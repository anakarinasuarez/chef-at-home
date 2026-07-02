'use client';

import { ReactNode } from 'react';

export type IconButtonVariant = 'ghost' | 'solid' | 'danger';

interface IconButtonProps {
  /** Icon element (rendered at 20px). */
  children: ReactNode;
  /** Required for a11y — icon-only controls have no text label. */
  'aria-label': string;
  variant?: IconButtonVariant;
  onClick?: (e?: React.MouseEvent) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// Square 40×40, radius-sm, centered 20px icon, token-driven.
const BASE =
  'inline-flex h-10 w-10 items-center justify-center rounded-sm text-xl leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-fg-disabled';

const VARIANT: Record<IconButtonVariant, string> = {
  ghost: 'text-fg hover:bg-elevated disabled:hover:bg-transparent',
  solid: 'bg-primary text-on-primary hover:bg-primary-hover disabled:bg-disabled',
  danger: 'bg-danger text-on-primary hover:bg-danger-hover disabled:bg-disabled',
};

export default function IconButton({
  children,
  'aria-label': ariaLabel,
  variant = 'ghost',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  'data-testid': dataTestId,
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={e => onClick?.(e)}
      data-testid={dataTestId}
      className={cn(BASE, VARIANT[variant], className)}
    >
      {children}
    </button>
  );
}
