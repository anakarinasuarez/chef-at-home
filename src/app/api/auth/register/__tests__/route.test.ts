import { getFirstZodError, safeValidateSchema } from '@/schemas';
import { authBackendService } from '@/services/authBackendService';
import type { UserResponse } from '@/types/auth';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../route';

// Mock the dependencies
vi.mock('@/services/authBackendService');
vi.mock('@/schemas', () => ({
  safeValidateSchema: vi.fn(),
  getFirstZodError: vi.fn(),
  registerSchema: {},
}));

const mockAuthBackendService = vi.mocked(authBackendService);
const mockSafeValidateSchema = vi.mocked(safeValidateSchema);
const mockGetFirstZodError = vi.mocked(getFirstZodError);

describe('/api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should register successfully with valid data', async () => {
      const requestBody = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: true,
        data: requestBody,
      });

      mockAuthBackendService.register.mockResolvedValue({
        success: true,
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        } as UserResponse,
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData).toEqual({
        message: 'User successfully registered',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      expect(mockAuthBackendService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return validation error for invalid input', async () => {
      const requestBody = {
        name: '',
        email: 'invalid-email',
        password: '123',
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: false,
        error: { issues: [{ message: 'Name is required' }] },
      } as unknown as ReturnType<typeof safeValidateSchema>);

      mockGetFirstZodError.mockReturnValue('Name is required');

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'Validation failed',
        details: 'Name is required',
      });
      expect(mockAuthBackendService.register).not.toHaveBeenCalled();
    });

    it('should return 400 for registration failure', async () => {
      const requestBody = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: true,
        data: requestBody,
      });

      mockAuthBackendService.register.mockResolvedValue({
        success: false,
        error: 'Email already exists',
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'Email already exists',
      });
    });

    it('should handle internal server error', async () => {
      const requestBody = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Database error')),
      } as unknown as NextRequest;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Internal Server Error',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Error en registro:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle JSON parsing error', async () => {
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Internal Server Error',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Error en registro:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
