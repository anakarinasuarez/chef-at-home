import { authService } from '@/services/authService';
import { UserResponse } from '@/types/auth';
import { UserStorageManager } from '@/utils/userStorage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Estado inicial estandarizado
const initialState = {
  user: null as UserResponse | null,
  isLoading: false,
  error: null as string | null,
};

export interface AuthState {
  // Estado
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;

  // Acciones básicas
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
  initializeAuth: () => void;

  // Acciones específicas de autenticación
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones básicas
      setUser: user => set({ user, error: null }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),
      clearError: () => set({ error: null }),
      logout: () => {
        set({ user: null, error: null });
        authService.removeUserFromStorage();

        // Clear all recipes when logging out
        const allKeys = Object.keys(localStorage);
        const recipeKeys = allKeys.filter(key => key.startsWith('recipe-'));
        recipeKeys.forEach(key => {
          localStorage.removeItem(key);
          console.log(`🗑️ Removed recipe on logout: ${key}`);
        });
      },

      // Inicializar usuario desde localStorage
      initializeAuth: () => {
        console.log('🔄 initializeAuth called');
        const storedUser = authService.getUserFromStorage();
        console.log('🔄 Stored user from service:', storedUser);

        if (storedUser) {
          console.log('🔄 Setting user from storage:', storedUser);
          set({ user: storedUser, isLoading: false });

          // Clear recipes from other users when initializing
          UserStorageManager.clearOtherUsersRecipes(storedUser.id);
        } else {
          console.log('🔄 No stored user found, setting user to null');
          set({ user: null, isLoading: false });

          // Clear all recipes when no user is logged in
          const allKeys = Object.keys(localStorage);
          const recipeKeys = allKeys.filter(key => key.startsWith('recipe-'));
          recipeKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`🗑️ Removed recipe on init (no user): ${key}`);
          });
        }
      },

      // Login - Usa el servicio externo
      login: async (email: string, password: string): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });

          const result = await authService.login({ email, password });

          if (result.success && result.user) {
            set({ user: result.user, isLoading: false });
            authService.saveUserToStorage(result.user);

            // Clear recipes from other users when logging in
            UserStorageManager.clearOtherUsersRecipes(result.user.id);

            return true;
          } else {
            set({ error: result.error || 'Login failed', isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ error: 'An unexpected error occurred', isLoading: false });
          return false;
        }
      },

      // Register - Usa el servicio externo
      register: async (name: string, email: string, password: string): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });

          const result = await authService.register({ name, email, password });

          if (result.success && result.user) {
            set({ user: result.user, isLoading: false });
            authService.saveUserToStorage(result.user);

            // Clear recipes from other users when registering
            UserStorageManager.clearOtherUsersRecipes(result.user.id);

            return true;
          } else {
            set({
              error: result.error || 'Registration failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          console.error('Registration error:', error);
          set({ error: 'An unexpected error occurred', isLoading: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user }), // Solo persistir el usuario
    }
  )
);

// Selectores estandarizados para evitar renders innecesarios
export const useUser = () => useAuthStore(state => state.user);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);

// Selector de acciones
export const useAuthActions = () =>
  useAuthStore(state => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    logout: state.logout,
    login: state.login,
    register: state.register,
  }));
