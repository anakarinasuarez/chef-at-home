interface FormFieldProps {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password';
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  className?: string;
  error?: string;
  'data-testid'?: string;
}

const cn = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

export default function FormField({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  className = '',
  error,
  'data-testid': dataTestId,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className='text-[13px] text-muted'>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        data-testid={dataTestId}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-sm border bg-input px-lg py-md text-base text-fg placeholder:text-muted',
          'focus:outline-none focus-visible:outline-none',
          error ? 'border-danger focus:border-danger' : 'border-border-strong focus:border-primary',
        )}
      />
      {error && <p className='mt-1 text-sm text-danger'>{error}</p>}
    </div>
  );
}
