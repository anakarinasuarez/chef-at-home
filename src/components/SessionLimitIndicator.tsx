'use client';

import { colors } from '@/design-system';
import { sessionLimitsManager } from '@/lib/sessionLimits';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface SessionLimitIndicatorProps {
  userId: string;
  className?: string;
}

export default function SessionLimitIndicator({
  userId,
  className = '',
}: SessionLimitIndicatorProps) {
  const [remainingRecipes, setRemainingRecipes] = useState<number>(1);
  const [canGenerate, setCanGenerate] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const updateLimitStatus = () => {
      const remaining = sessionLimitsManager.getRemainingRecipes(userId);
      const canGen = sessionLimitsManager.canGenerateRecipe(userId);

      setRemainingRecipes(remaining);
      setCanGenerate(canGen);
    };

    // Actualizar estado inicial
    updateLimitStatus();

    // Escuchar cambios en localStorage para actualizar en tiempo real
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chef-at-home-sessions') {
        updateLimitStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userId]);

  if (!userId) return null;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${className}`}
      style={{
        backgroundColor: canGenerate
          ? colors.interface.background.secondary
          : colors.semantic.error[50],
        border: `1px solid ${canGenerate ? colors.interface.border.light : colors.semantic.error[500]}`,
      }}
    >
      {canGenerate ? (
        <FaCheckCircle className='text-green-500' style={{ color: colors.semantic.success[500] }} />
      ) : (
        <FaExclamationTriangle
          className='text-red-500'
          style={{ color: colors.semantic.error[500] }}
        />
      )}

      <span
        className='text-sm font-medium'
        style={{
          color: canGenerate ? colors.interface.text.primary : colors.semantic.error[700],
        }}
      >
        {canGenerate
          ? `Recipes remaining: ${remainingRecipes}`
          : 'Session limit reached (1 recipe max)'}
      </span>
    </div>
  );
}
