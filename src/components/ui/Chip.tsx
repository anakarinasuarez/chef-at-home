'use client';

import { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// Built on the secondary-button look: radius-sm, px-xl py-lg, token-driven.
const BASE =
  'inline-flex items-center justify-center rounded-sm border px-xl py-lg font-sans font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-border-disabled disabled:text-fg-disabled';

const SELECTED = 'bg-secondary border-secondary text-[#131313]';
const UNSELECTED = 'border-primary text-primary hover:bg-secondary hover:text-primary-hover';

export default function Chip({
  children,
  selected = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={e => onClick?.(e)}
      data-testid={dataTestId}
      className={cn(BASE, selected ? SELECTED : UNSELECTED, className)}
    >
      {children}
    </button>
  );
}
