import { vi } from 'vitest'

// Mock Auth Context
export const mockAuthContext = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  },
  isLoading: false,
  error: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}

// Mock Notification Context
export const mockNotificationContext = {
  showNotification: vi.fn(),
  hideNotification: vi.fn(),
}

// Mock contexts
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@/contexts/NotificationContext', () => ({
  useNotification: () => mockNotificationContext,
  NotificationProvider: ({ children }: { children: React.ReactNode }) => children,
}))
