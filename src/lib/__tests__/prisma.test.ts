import { PrismaClient } from '@prisma/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock PrismaClient
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

// Typed view of the real global object used by src/lib/prisma.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

describe('Prisma Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    globalForPrisma.prisma = undefined;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    globalForPrisma.prisma = undefined;
  });

  it('should create a new PrismaClient instance when none exists', async () => {
    // Import after resetting modules and clearing the global
    const { prisma } = await import('../prisma');

    expect(PrismaClient).toHaveBeenCalledTimes(1);
    expect(prisma).toBeDefined();
  });

  it('should reuse existing PrismaClient instance', async () => {
    // Create a mock instance and expose it on the global
    const mockPrismaInstance = new PrismaClient();
    globalForPrisma.prisma = mockPrismaInstance;
    vi.clearAllMocks(); // ignore the manual instantiation above

    // Import after setting global
    const { prisma } = await import('../prisma');

    expect(PrismaClient).not.toHaveBeenCalled();
    expect(prisma).toBe(mockPrismaInstance);
  });

  it('should set global prisma in non-production environment', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    // Import after setting environment
    const { prisma } = await import('../prisma');

    expect(globalForPrisma.prisma).toBe(prisma);
  });

  it('should not set global prisma in production environment', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    // Import after setting environment
    const { prisma } = await import('../prisma');

    expect(globalForPrisma.prisma).toBeUndefined();
    expect(prisma).toBeDefined();
  });

  it('should handle PrismaClient instantiation errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock PrismaClient to throw an error
    vi.mocked(PrismaClient).mockImplementationOnce(() => {
      throw new Error('Connection failed');
    });

    // Import should propagate the instantiation error
    await expect(import('../prisma')).rejects.toThrow('Connection failed');

    consoleErrorSpy.mockRestore();
  });

  it('should export prisma instance', async () => {
    const { prisma } = await import('../prisma');

    expect(prisma).toBeDefined();
    expect(typeof prisma).toBe('object');
  });
});
