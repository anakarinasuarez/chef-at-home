'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'danger-solid'
  | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  href?: string;
  variant: ButtonVariant;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  size?: ButtonSize;
  fullWidth?: boolean;
  'aria-label'?: string;
  'data-testid'?: string;
}

const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// Base: Poppins Medium, radius-sm (6px), centered, token-driven, no inline styles.
const BASE =
  'inline-flex items-center justify-center gap-sm rounded-sm font-sans font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:pointer-events-none';

// Padding per size (Figma: md = px-xl py-lg, lg = px-3xl py-lg). Not applied to `icon`.
const SIZE: Record<ButtonSize, string> = {
  sm: 'px-lg py-sm text-sm',
  md: 'px-xl py-lg text-base',
  lg: 'px-3xl py-lg text-base',
};

// Enabled + disabled treatment per variant (disabled overrides semantic color).
const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-hover disabled:bg-disabled disabled:text-fg-disabled',
  secondary:
    'border border-primary text-primary hover:bg-secondary hover:text-primary-hover disabled:border-border-disabled disabled:text-fg-disabled disabled:hover:bg-transparent',
  tertiary:
    'text-primary hover:text-primary-hover disabled:text-fg-disabled',
  danger:
    'text-danger hover:text-danger-hover disabled:text-fg-disabled',
  'danger-solid':
    'bg-danger text-on-primary hover:bg-danger-hover disabled:bg-disabled disabled:text-fg-disabled',
  icon: 'p-md rounded-sm text-fg hover:bg-elevated disabled:text-fg-disabled disabled:hover:bg-transparent',
};

export default function Button({
  href,
  variant,
  children,
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  size = 'md',
  fullWidth = false,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: ButtonProps) {
  const classes = cn(
    // legacy hooks kept for existing selectors/tests
    'button',
    `button-${variant}`,
    `button-${size}`,
    BASE,
    variant === 'icon' ? '' : SIZE[size],
    VARIANT[variant],
    fullWidth && 'w-full',
    className,
  );

  // Render as a Link only when it has an href and is not a submit/disabled control.
  if (href && type !== 'submit' && !disabled) {
    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        data-testid={dataTestId}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
      onClick={e => onClick?.(e)}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
}
