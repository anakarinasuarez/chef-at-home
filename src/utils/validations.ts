// Funciones de validación reutilizables

export const validateEmail = (email: string): boolean => {
  // Balanced email validation - allows common formats but rejects obvious invalid ones
  const emailRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRequired = (
  value: unknown,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
};

export const validateStringLength = (
  value: string,
  fieldName: string,
  min: number,
  max: number
): { isValid: boolean; error?: string } => {
  if (value.length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters long`,
    };
  }

  if (value.length > max) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${max} characters long`,
    };
  }

  return { isValid: true };
};
