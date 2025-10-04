import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthBackendService, authBackendService } from '../authBackendService';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

// Mock console.error
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('AuthBackendService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = AuthBackendService.getInstance();
      const instance2 = AuthBackendService.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(AuthBackendService);
    });

    it('should export singleton instance', () => {
      expect(authBackendService).toBeInstanceOf(AuthBackendService);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);

      const result = await authBackendService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: mockUser.createdAt,
      });
      expect(result.error).toBeUndefined();
    });

    it('should fail login with non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await authBackendService.login({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
      expect(result.user).toBeUndefined();
    });

    it('should fail login with invalid password', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const result = await authBackendService.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
      expect(result.user).toBeUndefined();
    });

    it('should handle database errors during login', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database error'));

      const result = await authBackendService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('An unexpected error occurred');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Login error:', expect.any(Error));
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const mockUser = {
        id: '1',
        name: 'New User',
        email: 'new@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedPassword');
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

      const result = await authBackendService.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: '1',
        name: 'New User',
        email: 'new@example.com',
        createdAt: mockUser.createdAt,
      });
      expect(result.error).toBeUndefined();
    });

    it('should fail registration with existing email', async () => {
      const existingUser = {
        id: '1',
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);

      const result = await authBackendService.register({
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User with this email already exists');
      expect(result.user).toBeUndefined();
    });

    it('should handle database errors during registration', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database error'));

      const result = await authBackendService.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('An unexpected error occurred');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Registration error:', expect.any(Error));
    });

    it('should hash password with correct salt rounds', async () => {
      const mockUser = {
        id: '1',
        name: 'New User',
        email: 'new@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedPassword');
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

      await authBackendService.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await authBackendService.getUserById('1');

      expect(result).toEqual({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: mockUser.createdAt,
      });
    });

    it('should return null when user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await authBackendService.getUserById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database error'));

      const result = await authBackendService.getUserById('1');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Get user by ID error:', expect.any(Error));
    });
  });
});
