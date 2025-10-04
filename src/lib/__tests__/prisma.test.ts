import { PrismaClient } from '@prisma/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock PrismaClient
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

// Mock global object
const mockGlobal = {
  prisma: undefined,
};

vi.stubGlobal('globalThis', mockGlobal);

describe('Prisma Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGlobal.prisma = undefined;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create a new PrismaClient instance when none exists', async () => {
    // Import after mocking
    const { prisma } = await import('../prisma');

    expect(PrismaClient).toHaveBeenCalledTimes(1);
    expect(prisma).toBeDefined();
  });

  it('should reuse existing PrismaClient instance in development', async () => {
    // Create a mock instance
    const mockPrismaInstance = new PrismaClient();
    mockGlobal.prisma = mockPrismaInstance;

    // Import after setting global
    const { prisma } = await import('../prisma');

    expect(PrismaClient).not.toHaveBeenCalled();
    expect(prisma).toBe(mockPrismaInstance);
  });

  it('should set global prisma in non-production environment', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // Import after setting environment
    const { prisma } = await import('../prisma');

    expect(mockGlobal.prisma).toBe(prisma);

    process.env.NODE_ENV = originalEnv;
  });

  it('should not set global prisma in production environment', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Import after setting environment
    const { prisma } = await import('../prisma');

    expect(mockGlobal.prisma).toBeUndefined();
    expect(prisma).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle PrismaClient instantiation errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock PrismaClient to throw an error
    vi.mocked(PrismaClient).mockImplementationOnce(() => {
      throw new Error('Connection failed');
    });

    // Import should not throw
    await expect(async () => {
      await import('../prisma');
    }).rejects.toThrow('Connection failed');

    consoleErrorSpy.mockRestore();
  });

  it('should export prisma instance', async () => {
    const { prisma } = await import('../prisma');

    expect(prisma).toBeDefined();
    expect(typeof prisma).toBe('object');
  });
});
