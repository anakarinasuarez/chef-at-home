'use client';

import Chip from './Chip';

export type ServingValue = 'none' | 2 | 4 | 6;

interface ServingSelectorProps {
  value: ServingValue;
  onChange: (value: ServingValue) => void;
  /** Options rendered as chips, in order. Defaults to none / 2 / 4 / 6. */
  options?: ServingValue[];
  className?: string;
  'aria-label'?: string;
}

const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

const labelFor = (value: ServingValue) => (value === 'none' ? 'None' : String(value));

export default function ServingSelector({
  value,
  onChange,
  options = ['none', 2, 4, 6],
  className = '',
  'aria-label': ariaLabel = 'Serving amount',
}: ServingSelectorProps) {
  return (
    <div role='group' aria-label={ariaLabel} className={cn('flex gap-sm', className)}>
      {options.map(option => (
        <Chip
          key={String(option)}
          selected={option === value}
          onClick={() => onChange(option)}
          data-testid={`serving-option-${option}`}
        >
          {labelFor(option)}
        </Chip>
      ))}
    </div>
  );
}
