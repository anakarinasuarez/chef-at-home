'use client';

import { ReactNode } from 'react';
import { MdClose } from 'react-icons/md';

interface TagProps {
  children: ReactNode;
  /** When provided, renders a trailing remove (×) button. */
  onRemove?: () => void;
  /** Accessible label for the remove button (defaults to a generic label). */
  removeLabel?: string;
  className?: string;
  'data-testid'?: string;
}

const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// Elevated chip: 1px border, px-sm py-xs, radius-sm, 13px medium muted.
const BASE =
  'inline-flex items-center rounded-sm border border-border bg-elevated px-sm py-xs text-[13px] font-medium text-muted';

export default function Tag({
  children,
  onRemove,
  removeLabel = 'Remove',
  className = '',
  'data-testid': dataTestId,
}: TagProps) {
  return (
    <span
      data-testid={dataTestId}
      className={cn(BASE, onRemove && 'gap-1.5', className)}
    >
      {children}
      {onRemove && (
        <button
          type='button'
          onClick={onRemove}
          aria-label={removeLabel}
          className='inline-flex items-center justify-center rounded-sm text-xs text-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-elevated'
        >
          <MdClose />
        </button>
      )}
    </span>
  );
}
