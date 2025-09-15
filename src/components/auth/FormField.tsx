import { colors, typography } from "@/design-system";

interface FormFieldProps {
  id: string;
  name: string;
  type: "text" | "email" | "password";
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  className?: string;
  error?: string;
}

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
  className = "",
  error,
}: FormFieldProps) {
  return (
    <>
      <label
        htmlFor={id}
        className={`block text-white font-medium mb-1 ${className}`}
        style={{
          fontSize: typography.styles["body"].fontSize,
          fontWeight: typography.styles["body"].fontWeight,
          color: colors.interface.text.primary,
        }}
      >
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
        className={`w-80 px-3 py-3 bg-white text-gray-800 rounded-lg border-0 focus:outline-none focus:ring-2 ${
          error 
            ? "focus:ring-red-500 border-red-500" 
            : "focus:ring-green-500"
        }`}
        style={{
          fontSize: typography.styles["caption"].fontSize,
          fontFamily: typography.styles["caption"].fontFamily.join(", "),
          fontWeight: typography.styles["caption"].fontWeight,
          lineHeight: typography.styles["caption"].lineHeight,
          letterSpacing: typography.styles["caption"].letterSpacing,
        }}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
    </>
  );
}
