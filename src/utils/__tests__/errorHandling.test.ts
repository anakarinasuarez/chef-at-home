import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorHandler, type ErrorInfo } from '../errorHandling';

describe('ErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('normalizeError', () => {
    it('should return Error instance as is', () => {
      const error = new Error('Test error');
      const result = ErrorHandler.normalizeError(error);

      expect(result).toBe(error);
      expect(result.message).toBe('Test error');
    });

    it('should convert string to Error', () => {
      const errorString = 'String error';
      const result = ErrorHandler.normalizeError(errorString);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('String error');
    });

    it('should convert object with message to Error', () => {
      const errorObj = { message: 'Object error', code: 500 };
      const result = ErrorHandler.normalizeError(errorObj);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Object error');
    });

    it('should handle object without message', () => {
      const errorObj = { code: 500, status: 'error' };
      const result = ErrorHandler.normalizeError(errorObj);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown error occurred');
    });

    it('should handle null', () => {
      const result = ErrorHandler.normalizeError(null);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown error occurred');
    });

    it('should handle undefined', () => {
      const result = ErrorHandler.normalizeError(undefined);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown error occurred');
    });

    it('should handle number', () => {
      const result = ErrorHandler.normalizeError(42);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown error occurred');
    });
  });

  describe('generateErrorId', () => {
    it('should generate unique error IDs', () => {
      const id1 = ErrorHandler.generateErrorId();
      const id2 = ErrorHandler.generateErrorId();

      expect(id1).toMatch(/^error_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^error_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should include timestamp in error ID', () => {
      const beforeTime = Date.now();
      const id = ErrorHandler.generateErrorId();
      const afterTime = Date.now();

      const timestamp = parseInt(id.split('_')[1]);
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('extractErrorInfo', () => {
    it('should extract error info from Error instance', () => {
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      const result = ErrorHandler.extractErrorInfo(error);

      expect(result.message).toBe('Test error');
      expect(result.stack).toBe('Error stack trace');
      expect(result.severity).toBe('low');
      expect(result.context).toBeUndefined();
    });

    it('should extract error info with context', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'save' };

      const result = ErrorHandler.extractErrorInfo(error, context);

      expect(result.message).toBe('Test error');
      expect(result.context).toEqual(context);
    });

    it('should determine severity correctly', () => {
      const networkError = new Error('Network connection failed');
      const unauthorizedError = new Error('Unauthorized access');
      const criticalError = new Error('Critical system failure');
      const normalError = new Error('Normal error');

      expect(ErrorHandler.extractErrorInfo(networkError).severity).toBe('medium');
      expect(ErrorHandler.extractErrorInfo(unauthorizedError).severity).toBe('high');
      expect(ErrorHandler.extractErrorInfo(criticalError).severity).toBe('critical');
      expect(ErrorHandler.extractErrorInfo(normalError).severity).toBe('low');
    });

    it('should handle fetch errors as medium severity', () => {
      const fetchError = new Error('Failed to fetch data');

      const result = ErrorHandler.extractErrorInfo(fetchError);

      expect(result.severity).toBe('medium');
    });

    it('should handle forbidden errors as high severity', () => {
      const forbiddenError = new Error('Forbidden access');

      const result = ErrorHandler.extractErrorInfo(forbiddenError);

      expect(result.severity).toBe('high');
    });
  });

  describe('handleError', () => {
    it('should handle error with all options', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      const options = {
        componentName: 'TestComponent',
        userId: 'user123',
        logToConsole: true,
        context: { action: 'test' },
      };

      const result = ErrorHandler.handleError(error, options);

      expect(result.message).toBe('Test error');
      expect(result.componentName).toBe('TestComponent');
      expect(result.userId).toBe('user123');
      expect(result.context).toEqual({ action: 'test' });
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should not log to console when logToConsole is false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      const options = {
        componentName: 'TestComponent',
        logToConsole: false,
      };

      ErrorHandler.handleError(error, options);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should log to console by default', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      ErrorHandler.handleError(error);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should generate error ID for logging', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      ErrorHandler.handleError(error, { componentName: 'TestComponent' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^\[error_\d+_[a-z0-9]+\] Error in TestComponent:/),
        error
      );

      consoleSpy.mockRestore();
    });
  });

  describe('isErrorType', () => {
    it('should identify error type correctly', () => {
      const networkError = new Error('Network connection failed');
      const authError = new Error('Authentication failed');
      const normalError = new Error('Normal error');

      expect(ErrorHandler.isErrorType(networkError, 'network')).toBe(true);
      expect(ErrorHandler.isErrorType(authError, 'authentication')).toBe(true);
      expect(ErrorHandler.isErrorType(normalError, 'network')).toBe(false);
    });

    it('should be case insensitive', () => {
      const error = new Error('NETWORK CONNECTION FAILED');

      expect(ErrorHandler.isErrorType(error, 'network')).toBe(true);
      expect(ErrorHandler.isErrorType(error, 'NETWORK')).toBe(true);
      expect(ErrorHandler.isErrorType(error, 'Network')).toBe(true);
    });

    it('should handle string errors', () => {
      const errorString = 'Network error occurred';

      expect(ErrorHandler.isErrorType(errorString, 'network')).toBe(true);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return network error message', () => {
      const networkError = new Error('Network connection failed');

      const result = ErrorHandler.getUserFriendlyMessage(networkError);

      expect(result).toBe('Network error. Please check your connection and try again.');
    });

    it('should return unauthorized error message', () => {
      const authError = new Error('Unauthorized access');

      const result = ErrorHandler.getUserFriendlyMessage(authError);

      expect(result).toBe('Please log in to continue.');
    });

    it('should return not found error message', () => {
      const notFoundError = new Error('Resource not found');

      const result = ErrorHandler.getUserFriendlyMessage(notFoundError);

      expect(result).toBe('The requested resource was not found.');
    });

    it('should return quota error message', () => {
      const quotaError = new Error('API quota exceeded');

      const result = ErrorHandler.getUserFriendlyMessage(quotaError);

      expect(result).toBe('Service limit reached. Please try again later.');
    });

    it('should return limit error message', () => {
      const limitError = new Error('Rate limit exceeded');

      const result = ErrorHandler.getUserFriendlyMessage(limitError);

      expect(result).toBe('Service limit reached. Please try again later.');
    });

    it('should return generic message for unknown errors', () => {
      const unknownError = new Error('Some random error');

      const result = ErrorHandler.getUserFriendlyMessage(unknownError);

      expect(result).toBe('Something went wrong. Please try again.');
    });

    it('should handle string errors', () => {
      const errorString = 'Network connection failed';

      const result = ErrorHandler.getUserFriendlyMessage(errorString);

      expect(result).toBe('Network error. Please check your connection and try again.');
    });

    it('should handle non-Error objects', () => {
      const errorObj = { message: 'Network error' };

      const result = ErrorHandler.getUserFriendlyMessage(errorObj);

      expect(result).toBe('Network error. Please check your connection and try again.');
    });
  });

  describe('ErrorInfo interface', () => {
    it('should create ErrorInfo object with all properties', () => {
      const errorInfo: ErrorInfo = {
        message: 'Test error',
        stack: 'Error stack',
        severity: 'medium',
        userId: 'user123',
        componentName: 'TestComponent',
        context: { action: 'test' },
      };

      expect(errorInfo.message).toBe('Test error');
      expect(errorInfo.stack).toBe('Error stack');
      expect(errorInfo.severity).toBe('medium');
      expect(errorInfo.userId).toBe('user123');
      expect(errorInfo.componentName).toBe('TestComponent');
      expect(errorInfo.context).toEqual({ action: 'test' });
    });

    it('should create ErrorInfo object with minimal properties', () => {
      const errorInfo: ErrorInfo = {
        message: 'Test error',
      };

      expect(errorInfo.message).toBe('Test error');
      expect(errorInfo.stack).toBeUndefined();
      expect(errorInfo.severity).toBeUndefined();
      expect(errorInfo.userId).toBeUndefined();
      expect(errorInfo.componentName).toBeUndefined();
      expect(errorInfo.context).toBeUndefined();
    });
  });
});
