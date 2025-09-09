import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'

describe('useAuth', () => {
  const mockUser = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.removeItem).mockClear()
    
    // Reset fetch mock
    vi.mocked(fetch).mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('initializes with null user and loading true', () => {
      const { result } = renderHook(() => useAuth())
      
      expect(result.current.user).toBe(null)
      expect(result.current.isLoading).toBe(true)
      expect(result.current.error).toBe(null)
    })

    it('checks for existing token on mount', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('existing-token')
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      } as Response)
      
      renderHook(() => useAuth())
      
      expect(localStorage.getItem).toHaveBeenCalledWith('auth-token')
    })

    it('sets user when valid token exists', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('valid-token')
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      await act(async () => {
        // Wait for the auth check to complete
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('removes invalid token and sets user to null', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid-token')
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(result.current.user).toBe(null)
      expect(result.current.isLoading).toBe(false)
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token')
    })

    it('handles network errors during auth check', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('token')
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
      
      const { result } = renderHook(() => useAuth())
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(result.current.user).toBe(null)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Login', () => {
    it('logs in successfully with valid credentials', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let loginResult: boolean
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123')
      })
      
      expect(loginResult!).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('handles login failure with error message', async () => {
      const errorMessage = 'Invalid credentials'
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: errorMessage }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let loginResult: boolean
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'wrongpassword')
      })
      
      expect(loginResult!).toBe(false)
      expect(result.current.user).toBe(null)
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)
    })

    it('handles login failure without error message', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let loginResult: boolean
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'wrongpassword')
      })
      
      expect(loginResult!).toBe(false)
      expect(result.current.user).toBe(null)
      expect(result.current.error).toBe('Login failed')
      expect(result.current.isLoading).toBe(false)
    })

    it('handles network errors during login', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
      
      const { result } = renderHook(() => useAuth())
      
      let loginResult: boolean
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123')
      })
      
      expect(loginResult!).toBe(false)
      expect(result.current.user).toBe(null)
      expect(result.current.error).toBe('An unexpected error occurred')
      expect(result.current.isLoading).toBe(false)
    })

    it('sets loading state during login', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      
      vi.mocked(fetch).mockReturnValueOnce(promise)
      
      const { result } = renderHook(() => useAuth())
      
      act(() => {
        result.current.login('test@example.com', 'password123')
      })
      
      expect(result.current.isLoading).toBe(true)
      
      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve({ user: mockUser }),
        })
        await promise
      })
      
      expect(result.current.isLoading).toBe(false)
    })

    it('clears previous error on new login attempt', async () => {
      // First login attempt fails
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'First error' }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      await act(async () => {
        await result.current.login('test@example.com', 'wrongpassword')
      })
      
      expect(result.current.error).toBe('First error')
      
      // Second login attempt succeeds
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      } as Response)
      
      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })
      
      expect(result.current.error).toBe(null)
      expect(result.current.user).toEqual(mockUser)
    })
  })

  describe('Register', () => {
    it('registers successfully with valid data', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Registration successful' }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let registerResult: boolean
      await act(async () => {
        registerResult = await result.current.register('Test User', 'test@example.com', 'password123')
      })
      
      expect(registerResult!).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
      // User should not be automatically logged in
      expect(result.current.user).toBe(null)
    })

    it('handles registration failure with error message', async () => {
      const errorMessage = 'Email already exists'
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: errorMessage }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let registerResult: boolean
      await act(async () => {
        registerResult = await result.current.register('Test User', 'existing@example.com', 'password123')
      })
      
      expect(registerResult!).toBe(false)
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)
    })

    it('handles registration failure without error message', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let registerResult: boolean
      await act(async () => {
        registerResult = await result.current.register('Test User', 'test@example.com', 'password123')
      })
      
      expect(registerResult!).toBe(false)
      expect(result.current.error).toBe('Registration failed')
      expect(result.current.isLoading).toBe(false)
    })

    it('handles network errors during registration', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
      
      const { result } = renderHook(() => useAuth())
      
      let registerResult: boolean
      await act(async () => {
        registerResult = await result.current.register('Test User', 'test@example.com', 'password123')
      })
      
      expect(registerResult!).toBe(false)
      expect(result.current.error).toBe('An unexpected error occurred')
      expect(result.current.isLoading).toBe(false)
    })

    it('sets loading state during registration', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      
      vi.mocked(fetch).mockReturnValueOnce(promise)
      
      const { result } = renderHook(() => useAuth())
      
      act(() => {
        result.current.register('Test User', 'test@example.com', 'password123')
      })
      
      expect(result.current.isLoading).toBe(true)
      
      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve({ message: 'Success' }),
        })
        await promise
      })
      
      expect(result.current.isLoading).toBe(false)
    })

    it('clears previous error on new registration attempt', async () => {
      // First registration attempt fails
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'First error' }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      await act(async () => {
        await result.current.register('Test User', 'test@example.com', 'password123')
      })
      
      expect(result.current.error).toBe('First error')
      
      // Second registration attempt succeeds
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      } as Response)
      
      await act(async () => {
        await result.current.register('Test User', 'test@example.com', 'password123')
      })
      
      expect(result.current.error).toBe(null)
    })
  })

  describe('Logout', () => {
    it('logs out successfully', () => {
      const { result } = renderHook(() => useAuth())
      
      // First set a user
      act(() => {
        result.current.user = mockUser
      })
      
      expect(result.current.user).toEqual(mockUser)
      
      // Then logout
      act(() => {
        result.current.logout()
      })
      
      expect(result.current.user).toBe(null)
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token')
    })

    it('handles logout when no user is logged in', () => {
      const { result } = renderHook(() => useAuth())
      
      expect(result.current.user).toBe(null)
      
      act(() => {
        result.current.logout()
      })
      
      expect(result.current.user).toBe(null)
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token')
    })
  })

  describe('API Calls', () => {
    it('makes correct API call for login', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })
      
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    })

    it('makes correct API call for registration', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      await act(async () => {
        await result.current.register('Test User', 'test@example.com', 'password123')
      })
      
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    })

    it('makes correct API call for auth check', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('token')
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      } as Response)
      
      renderHook(() => useAuth())
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(fetch).toHaveBeenCalledWith('/api/auth/me', {
        headers: {
          Authorization: 'Bearer token',
        },
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty email and password', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Missing credentials' }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let loginResult: boolean
      await act(async () => {
        loginResult = await result.current.login('', '')
      })
      
      expect(loginResult!).toBe(false)
      expect(result.current.error).toBe('Missing credentials')
    })

    it('handles special characters in credentials', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let loginResult: boolean
      await act(async () => {
        loginResult = await result.current.login('test+tag@example.com', 'p@ssw0rd!@#')
      })
      
      expect(loginResult!).toBe(true)
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test+tag@example.com',
          password: 'p@ssw0rd!@#',
        }),
      })
    })

    it('handles very long input strings', async () => {
      const longEmail = 'a'.repeat(1000) + '@example.com'
      const longPassword = 'b'.repeat(1000)
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid input' }),
      } as Response)
      
      const { result } = renderHook(() => useAuth())
      
      let loginResult: boolean
      await act(async () => {
        loginResult = await result.current.login(longEmail, longPassword)
      })
      
      expect(loginResult!).toBe(false)
      expect(result.current.error).toBe('Invalid input')
    })

    it('handles concurrent login attempts', async () => {
      let resolveFirst: (value: any) => void
      let resolveSecond: (value: any) => void
      
      const firstPromise = new Promise(resolve => {
        resolveFirst = resolve
      })
      const secondPromise = new Promise(resolve => {
        resolveSecond = resolve
      })
      
      vi.mocked(fetch)
        .mockReturnValueOnce(firstPromise)
        .mockReturnValueOnce(secondPromise)
      
      const { result } = renderHook(() => useAuth())
      
      // Start two concurrent login attempts
      act(() => {
        result.current.login('test1@example.com', 'password1')
        result.current.login('test2@example.com', 'password2')
      })
      
      expect(result.current.isLoading).toBe(true)
      
      // Resolve first login
      await act(async () => {
        resolveFirst!({
          ok: true,
          json: () => Promise.resolve({ user: mockUser }),
        })
        await firstPromise
      })
      
      // Resolve second login
      await act(async () => {
        resolveSecond!({
          ok: true,
          json: () => Promise.resolve({ user: mockUser }),
        })
        await secondPromise
      })
      
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', () => {
      const { result } = renderHook(() => useAuth())
      
      const initialUser = result.current.user
      const initialLoading = result.current.isLoading
      const initialError = result.current.error
      
      // Call logout when already logged out
      act(() => {
        result.current.logout()
      })
      
      expect(result.current.user).toBe(initialUser)
      expect(result.current.isLoading).toBe(initialLoading)
      expect(result.current.error).toBe(initialError)
    })

    it('handles rapid state changes efficiently', async () => {
      const { result } = renderHook(() => useAuth())
      
      // Rapid login attempts
      const promises = []
      for (let i = 0; i < 5; i++) {
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ user: mockUser }),
        } as Response)
        
        promises.push(result.current.login(`test${i}@example.com`, 'password'))
      }
      
      await act(async () => {
        await Promise.all(promises)
      })
      
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isLoading).toBe(false)
    })
  })
})
