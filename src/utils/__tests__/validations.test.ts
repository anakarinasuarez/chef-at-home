import { describe, expect, it } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateStringLength,
} from '../validations';

describe('Validations', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
      expect(validateEmail('test123@test-domain.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('test.@example.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('test@example..com')).toBe(false);
      expect(validateEmail('test@@example.com')).toBe(false);
      expect(validateEmail('test@example.com.')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Password123');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject passwords that are too short', () => {
      const result = validatePassword('Pass1');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters long');
    });

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('password123');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('PASSWORD123');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('Password');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should collect multiple errors', () => {
      const result = validatePassword('pass');

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('Password must be at least 6 characters long');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should handle empty password', () => {
      const result = validatePassword('');

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
    });

    it('should validate passwords with special characters', () => {
      const result = validatePassword('Password123!');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty strings', () => {
      const result = validateRequired('test', 'Field');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate non-empty numbers', () => {
      const result = validateRequired(123, 'Field');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate non-empty arrays', () => {
      const result = validateRequired([1, 2, 3], 'Field');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate non-empty objects', () => {
      const result = validateRequired({ key: 'value' }, 'Field');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty strings', () => {
      const result = validateRequired('', 'Field');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should reject whitespace-only strings', () => {
      const result = validateRequired('   ', 'Field');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should reject null values', () => {
      const result = validateRequired(null, 'Field');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should reject undefined values', () => {
      const result = validateRequired(undefined, 'Field');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should reject zero', () => {
      const result = validateRequired(0, 'Field');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should reject false', () => {
      const result = validateRequired(false, 'Field');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should use custom field name in error message', () => {
      const result = validateRequired('', 'Username');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username is required');
    });
  });

  describe('validateStringLength', () => {
    it('should validate strings within length limits', () => {
      const result = validateStringLength('hello', 'Field', 3, 10);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate strings at minimum length', () => {
      const result = validateStringLength('abc', 'Field', 3, 10);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate strings at maximum length', () => {
      const result = validateStringLength('abcdefghij', 'Field', 3, 10);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject strings shorter than minimum', () => {
      const result = validateStringLength('ab', 'Field', 3, 10);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field must be at least 3 characters long');
    });

    it('should reject strings longer than maximum', () => {
      const result = validateStringLength('abcdefghijk', 'Field', 3, 10);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field must be no more than 10 characters long');
    });

    it('should handle empty string', () => {
      const result = validateStringLength('', 'Field', 3, 10);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field must be at least 3 characters long');
    });

    it('should handle same min and max length', () => {
      const result1 = validateStringLength('abc', 'Field', 3, 3);
      const result2 = validateStringLength('ab', 'Field', 3, 3);
      const result3 = validateStringLength('abcd', 'Field', 3, 3);

      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(false);
      expect(result3.isValid).toBe(false);
    });

    it('should use custom field name in error messages', () => {
      const result1 = validateStringLength('ab', 'Username', 3, 10);
      const result2 = validateStringLength('abcdefghijk', 'Username', 3, 10);

      expect(result1.error).toBe('Username must be at least 3 characters long');
      expect(result2.error).toBe('Username must be no more than 10 characters long');
    });

    it('should handle zero minimum length', () => {
      const result = validateStringLength('', 'Field', 0, 10);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle very large maximum length', () => {
      const longString = 'a'.repeat(1000);
      const result = validateStringLength(longString, 'Field', 0, 2000);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
