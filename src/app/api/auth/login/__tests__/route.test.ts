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
  loginSchema: {},
}));

const mockAuthBackendService = vi.mocked(authBackendService);
const mockSafeValidateSchema = vi.mocked(safeValidateSchema);
const mockGetFirstZodError = vi.mocked(getFirstZodError);

describe('/api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should login successfully with valid credentials', async () => {
      const requestBody = {
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

      mockAuthBackendService.login.mockResolvedValue({
        success: true,
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        } as UserResponse,
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        message: 'Login successful',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      expect(mockAuthBackendService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return validation error for invalid input', async () => {
      const requestBody = {
        email: 'invalid-email',
        password: '123',
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: false,
        error: { issues: [{ message: 'Invalid email format' }] },
      } as unknown as ReturnType<typeof safeValidateSchema>);

      mockGetFirstZodError.mockReturnValue('Invalid email format');

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'Validation failed',
        details: 'Invalid email format',
      });
      expect(mockAuthBackendService.login).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid credentials', async () => {
      const requestBody = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as NextRequest;

      mockSafeValidateSchema.mockReturnValue({
        success: true,
        data: requestBody,
      });

      mockAuthBackendService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData).toEqual({
        error: 'Invalid credentials',
      });
    });

    it('should handle internal server error', async () => {
      const requestBody = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Network error')),
      } as unknown as NextRequest;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Internal Server Error',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Error en login:', expect.any(Error));

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
      expect(consoleSpy).toHaveBeenCalledWith('Error en login:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
