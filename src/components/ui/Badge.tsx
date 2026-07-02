import { ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'neutral' | 'danger';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  'data-testid'?: string;
}

const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// Pill: px-md py-xs, radius-full, 12px medium.
const BASE =
  'inline-flex items-center justify-center rounded-full px-md py-xs text-xs font-medium leading-none';

const VARIANT: Record<BadgeVariant, string> = {
  primary: 'bg-primary text-on-primary',
  // `secondary` is a light mint in both themes, so it pairs with a fixed dark ink.
  secondary: 'bg-secondary text-[#131313]',
  neutral: 'bg-elevated text-fg',
  danger: 'bg-danger text-on-primary',
};

export default function Badge({
  children,
  variant = 'primary',
  className = '',
  'data-testid': dataTestId,
}: BadgeProps) {
  return (
    <span
      data-testid={dataTestId}
      className={cn(BASE, VARIANT[variant], className)}
    >
      {children}
    </span>
  );
}
