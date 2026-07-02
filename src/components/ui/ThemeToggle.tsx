'use client';

import { useTheme } from '@/hooks/useTheme';
import { FiMoon, FiSun } from 'react-icons/fi';

interface ThemeToggleProps {
  className?: string;
}

/** Dark/light mode switch. Dark is the app default. */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-sm text-fg transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      {isLight ? <FiMoon size={20} /> : <FiSun size={20} />}
    </button>
  );
}
