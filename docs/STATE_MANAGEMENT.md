# State Management Documentation

## Overview

Chef at Home uses Zustand for state management, providing a lightweight and flexible solution for managing application state. This document covers the store architecture, patterns, and best practices.

## Store Architecture

### Core Principles

1. **Domain Separation**: Each store handles a specific domain
2. **Immutable Updates**: State updates are immutable
3. **Selective Subscriptions**: Components subscribe only to needed state
4. **Persistence**: Critical state is persisted to localStorage
5. **Error Handling**: Centralized error state management

### Store Structure

```
stores/
├── authStore.ts          # Authentication state
├── recipesStore.ts       # Recipe generation and management
├── savedRecipesStore.ts  # User's saved recipes
├── errorStore.ts         # Global error handling
├── toastStore.ts         # Toast notifications
└── index.ts             # Store exports
```

## Store Documentation

### AuthStore

Manages user authentication state and operations.

```typescript
interface AuthState {
  // State
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}
```

**Usage:**
```tsx
import { useAuthStore } from '@/stores/authStore';

// In component
const { user, isLoading, login, logout } = useAuthStore();

// Login
const handleLogin = async () => {
  const success = await login(email, password);
  if (success) {
    // Handle successful login
  }
};

// Logout
const handleLogout = () => {
  logout();
};
```

**Selectors:**
```tsx
// Individual selectors
const user = useUser();
const isLoading = useAuthLoading();
const error = useAuthError();

// Action selectors
const { login, register, logout } = useAuthActions();
```

**Persistence:**
- User data is persisted to localStorage
- Automatically restored on app initialization
- Cleared on logout

### RecipesStore

Manages recipe generation and temporary recipe state.

```typescript
interface RecipesState {
  // State
  recipes: UnifiedRecipe[];
  isLoading: boolean;
  error: string | null;
  hasLoadedRecipes: boolean;
  activeIndex: number;
  removingRecipeId: string | null;
  
  // Actions
  setRecipes: (recipes: UnifiedRecipe[]) => void;
  addRecipe: (recipe: UnifiedRecipe) => void;
  removeRecipe: (recipeId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setHasLoadedRecipes: (loaded: boolean) => void;
  setActiveIndex: (index: number) => void;
  setRemovingRecipeId: (id: string | null) => void;
  clearRecipes: () => void;
  generateRecipes: (ingredients: string[], servings: number) => Promise<void>;
  scrollToRecipe: (index: number) => void;
}
```

**Usage:**
```tsx
import { useRecipesStore } from '@/stores/recipesStore';

// Generate recipes
const generateRecipes = useRecipesStore(state => state.generateRecipes);
const isLoading = useRecipesStore(state => state.isLoading);

const handleGenerate = async () => {
  await generateRecipes(['chicken', 'rice'], 4);
};

// Access recipes
const recipes = useRecipes();
const activeIndex = useActiveRecipeIndex();
```

**Features:**
- AI recipe generation
- Recipe management (add, remove, clear)
- Active recipe tracking
- Loading and error states
- Persistence of generated recipes

### SavedRecipesStore

Manages user's saved recipes with local storage.

```typescript
interface SavedRecipesState {
  // State
  savedRecipes: FrontendRecipe[];
  isLoading: boolean;
  error: string | null;
  removingRecipeId: string | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setRemovingRecipeId: (id: string | null) => void;
  clearSavedRecipes: () => void;
  loadSavedRecipes: (userId: string) => void;
  saveRecipe: (recipe: FrontendRecipe, userId: string) => boolean;
  removeRecipe: (recipeId: string, userId: string) => boolean;
  updateRecipe: (recipeId: string, updatedRecipe: FrontendRecipe, userId: string) => boolean;
}
```

**Usage:**
```tsx
import { useSavedRecipesStore } from '@/stores/savedRecipesStore';

// Save recipe
const saveRecipe = useSavedRecipesStore(state => state.saveRecipe);
const savedRecipes = useSavedRecipes();

const handleSave = (recipe: FrontendRecipe) => {
  const success = saveRecipe(recipe, user.id);
  if (success) {
    // Show success message
  }
};

// Check if recipe is saved
const isSaved = savedRecipes.some(r => r.id === recipe.id);
```

**Features:**
- Local storage persistence
- Recipe CRUD operations
- User-specific recipe management
- Optimistic updates
- Error handling

### ErrorStore

Centralized error handling and management.

```typescript
interface ErrorState {
  // State
  errors: AppError[];
  currentError: AppError | null;
  isRetrying: boolean;
  retryCount: number;
  maxRetries: number;
  
  // Actions
  addError: (error: AppError) => void;
  removeError: (errorId: string) => void;
  clearErrors: () => void;
  setCurrentError: (error: AppError | null) => void;
  retryError: (errorId: string) => Promise<void>;
  setRetrying: (retrying: boolean) => void;
}
```

**Usage:**
```tsx
import { useErrorStore } from '@/stores/errorStore';

// Add error
const addError = useErrorStore(state => state.addError);

const handleError = (error: Error) => {
  addError({
    id: generateId(),
    message: error.message,
    timestamp: new Date(),
    level: 'error',
    context: 'recipe-generation'
  });
};

// Retry error
const retryError = useErrorStore(state => state.retryError);
const handleRetry = (errorId: string) => {
  retryError(errorId);
};
```

**Features:**
- Error collection and management
- Retry mechanisms
- Error categorization
- Timestamp tracking
- Context information

### ToastStore

Manages toast notifications throughout the application.

```typescript
interface ToastState {
  // State
  toasts: Toast[];
  maxToasts: number;
  
  // Actions
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}
```

**Usage:**
```tsx
import { useToastStore } from '@/stores/toastStore';

// Show notifications
const { showSuccess, showError } = useToastStore();

const handleSave = async () => {
  try {
    await saveRecipe(recipe);
    showSuccess('Recipe saved successfully!');
  } catch (error) {
    showError('Failed to save recipe');
  }
};
```

**Features:**
- Multiple toast types (success, error, warning, info)
- Auto-dismiss functionality
- Maximum toast limit
- Customizable duration
- Queue management

## Store Patterns

### 1. Initial State Pattern

All stores follow a consistent initial state pattern:

```typescript
const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      // Actions
    }),
    { name: 'store-name' }
  )
);
```

### 2. Selector Pattern

Provide specific selectors for better performance:

```typescript
// Individual selectors
export const useData = () => useStore(state => state.data);
export const useLoading = () => useStore(state => state.isLoading);
export const useError = () => useStore(state => state.error);

// Action selectors
export const useActions = () => useStore(state => ({
  setData: state.setData,
  setLoading: state.setLoading,
  setError: state.setError,
}));
```

### 3. Async Action Pattern

Handle async operations with proper error handling:

```typescript
const asyncAction = async (params: Params) => {
  set({ isLoading: true, error: null });
  
  try {
    const result = await service.performAction(params);
    set({ data: result, isLoading: false });
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    set({ error: errorMessage, isLoading: false });
    return { success: false, error: errorMessage };
  }
};
```

### 4. Persistence Pattern

Selective persistence for critical state:

```typescript
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Store implementation
    }),
    {
      name: 'store-storage',
      partialize: (state) => ({
        // Only persist specific fields
        user: state.user,
        preferences: state.preferences,
      }),
    }
  )
);
```

## Custom Hooks

### useAuthUnified

Unified authentication hook providing a clean interface:

```typescript
export const useAuthUnified = () => {
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const login = useAuthStore(state => state.login);
  const register = useAuthStore(state => state.register);
  const logout = useAuthStore(state => state.logout);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
```

### useRecipeCard

Hook for recipe card functionality:

```typescript
export const useRecipeCard = ({ recipe, variant, onRemoveFromList }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { user } = useAuthUnified();
  const { saveRecipe, removeRecipe } = useSavedRecipesActions();
  const { showSuccess, showError } = useToastStore();
  
  const handleSaveClick = useCallback(async (e: React.MouseEvent) => {
    e?.stopPropagation?.();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    setIsSaving(true);
    
    try {
      let success = false;
      
      if (isSaved) {
        success = removeRecipe(recipeId, user.id);
        if (success) showSuccess('Recipe removed from favorites');
      } else {
        success = saveRecipe(recipe, user.id);
        if (success) showSuccess('Recipe saved to favorites');
      }
      
      if (!success) {
        showError('Error saving recipe');
      }
    } catch (error) {
      showError('Error saving recipe');
    } finally {
      setIsSaving(false);
    }
  }, [user, recipe, saveRecipe, removeRecipe, isSaved]);
  
  return {
    isSaving,
    imageError,
    handleSaveClick,
    handleImageError: () => setImageError(true),
  };
};
```

## State Management Best Practices

### 1. Store Organization

- **Single Responsibility**: Each store handles one domain
- **Clear Naming**: Use descriptive names for stores and actions
- **Consistent Structure**: Follow the same pattern across stores
- **Type Safety**: Use TypeScript interfaces for all state

### 2. Performance Optimization

- **Selective Subscriptions**: Subscribe only to needed state
- **Memoization**: Use useMemo for expensive computations
- **Debouncing**: Debounce rapid state updates
- **Pagination**: Implement pagination for large datasets

### 3. Error Handling

- **Centralized Errors**: Use error store for global error management
- **User-Friendly Messages**: Provide clear error messages
- **Retry Mechanisms**: Implement retry logic for failed operations
- **Error Boundaries**: Use React error boundaries for component errors

### 4. Testing Stores

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

describe('AuthStore', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      const success = await result.current.login('test@example.com', 'password');
      expect(success).toBe(true);
    });
    
    expect(result.current.user).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });
});
```

### 5. Debugging

- **DevTools**: Use Zustand devtools for debugging
- **Logging**: Add console logs for development
- **State Inspection**: Use browser devtools to inspect state
- **Error Tracking**: Implement error tracking for production

## Migration Guide

### From Redux to Zustand

If migrating from Redux:

1. **Replace Redux Store**: Convert Redux store to Zustand
2. **Update Selectors**: Replace Redux selectors with Zustand selectors
3. **Remove Redux Dependencies**: Remove Redux-related packages
4. **Update Tests**: Update tests to use Zustand patterns

### Store Refactoring

When refactoring stores:

1. **Backup State**: Create backup of current state structure
2. **Gradual Migration**: Migrate one store at a time
3. **Update Components**: Update components to use new store structure
4. **Test Thoroughly**: Ensure all functionality works after migration

## Troubleshooting

### Common Issues

1. **State Not Updating**: Check if component is subscribed to store
2. **Persistence Issues**: Verify localStorage is available and not full
3. **Performance Issues**: Use selectors to prevent unnecessary re-renders
4. **Type Errors**: Ensure TypeScript interfaces match store structure

### Debug Tools

- **Zustand DevTools**: Browser extension for debugging
- **React DevTools**: Component state inspection
- **Console Logging**: Add temporary logs for debugging
- **Error Boundaries**: Catch and log component errors

## Future Considerations

### Scalability

- **Store Splitting**: Split large stores into smaller ones
- **Middleware**: Add middleware for logging, persistence, etc.
- **State Normalization**: Normalize complex nested state
- **Caching**: Implement intelligent caching strategies

### Performance

- **Virtual Scrolling**: For large lists
- **Lazy Loading**: For heavy components
- **Memoization**: For expensive computations
- **Debouncing**: For rapid state updates
