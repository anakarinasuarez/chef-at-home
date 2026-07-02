'use client';

import Button from '@/components/Button';
import { useAuthUnified } from '@/hooks';
import { getFirstZodError, loginSchema, registerSchema, safeValidateSchema } from '@/schemas';
import { useToastStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FormField from './FormField';

interface AuthFormProps {
  type: 'login' | 'signup';
  title: string;
  subtitle?: string;
}

export default function AuthForm({ type, title, subtitle }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { login, register } = useAuthUnified();
  const showSuccess = useToastStore(state => state.showSuccess);
  const showError = useToastStore(state => state.showError);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    try {
      // Validación adicional para signup: verificar que las contraseñas coincidan
      if (isSignup && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setFieldErrors({ confirmPassword: 'Passwords do not match' });
        showError('Passwords do not match');
        return;
      }

      // Validar datos con Zod
      const schema = type === 'login' ? loginSchema : registerSchema;
      const validation = safeValidateSchema(schema, formData);

      if (!validation.success) {
        // Procesar errores de validación
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((err: { path: (string | number)[]; message: string }) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setFieldErrors(errors);

        // Mostrar el primer error como mensaje general
        const firstError = getFirstZodError(validation.error);
        setError(firstError);
        showError(firstError);
        return;
      }

      // Proceder con autenticación si la validación es exitosa
      if (type === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) {
          showSuccess('Welcome back!');
          router.push('/create');
        } else {
          setError('Invalid email or password');
          showError('Invalid email or password');
        }
      } else {
        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          showSuccess('Account created successfully!');
          router.push('/create');
        } else {
          setError('Registration failed. Please try again.');
          showError('Registration failed. Please try again.');
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignup = type === 'signup';

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-form space-y-4'>
      {/* Campo Nombre (solo para signup) */}
      {isSignup && (
        <FormField
          id='name'
          name='name'
          type='text'
          label='Your name'
          placeholder='chef'
          value={formData.name}
          onChange={handleChange}
          required
          error={fieldErrors.name}
          data-testid='name-input'
        />
      )}

      {/* Campo Email */}
      <FormField
        id='email'
        name='email'
        type='email'
        label='Email'
        placeholder='chef@example.com'
        value={formData.email}
        onChange={handleChange}
        required
        error={fieldErrors.email}
        data-testid='email-input'
      />

      {/* Campo Contraseña */}
      <FormField
        id='password'
        name='password'
        type='password'
        label='Password'
        placeholder='Enter your password'
        value={formData.password}
        onChange={handleChange}
        required
        minLength={6}
        error={fieldErrors.password}
        data-testid='password-input'
      />

      {/* Campo Confirmar Contraseña (solo para signup) */}
      {isSignup && (
        <FormField
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          label='Confirm Password'
          placeholder='Confirm your password'
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          error={fieldErrors.confirmPassword}
          data-testid='confirm-password-input'
        />
      )}

      {/* Mensaje de Error */}
      {error && (
        <div
          className='text-danger text-sm bg-danger/10 p-md rounded-md'
          data-testid='error-message'
        >
          {error}
        </div>
      )}

      {/* Botones de Acción */}
      <div className='flex flex-col sm:flex-row gap-4 pt-4'>
        <Button
          type='submit'
          variant='primary'
          disabled={isLoading}
          fullWidth
          className='sm:w-auto'
          data-testid={isSignup ? 'signup-button' : 'login-button'}
        >
          {isLoading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
        </Button>
        <Button href='/' variant='secondary' fullWidth className='sm:w-auto'>
          Cancel
        </Button>
      </div>

      {/* Link adicional (login/signup) */}
      <div className='pt-2 text-base'>
        <span className='text-muted'>
          {type === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
        </span>
        <a
          href={type === 'signup' ? '/auth/login' : '/auth/signup'}
          className='text-primary underline cursor-pointer hover:text-primary-hover'
        >
          {type === 'signup' ? 'Sign in here' : 'Sign up here'}
        </a>
      </div>

      {/* Forgot Password Link (solo para login) */}
      {type !== 'signup' && (
        <div className='pt-2 text-left text-base'>
          <a
            href='/auth/forgot-password'
            className='text-primary underline cursor-pointer hover:text-primary-hover transition-colors'
          >
            Forgot your password?
          </a>
        </div>
      )}
    </form>
  );
}
