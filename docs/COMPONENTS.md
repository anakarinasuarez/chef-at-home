# Component Documentation

## Overview

This document provides comprehensive documentation for all React components in the Chef at Home application. Components are organized by category and include usage examples, props documentation, and implementation details.

## Component Categories

- [UI Components](#ui-components)
- [Layout Components](#layout-components)
- [Authentication Components](#authentication-components)
- [Recipe Components](#recipe-components)
- [Form Components](#form-components)

## UI Components

### Button

A versatile button component with multiple variants and states.

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
import Button from '@/components/Button';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Save Recipe
</Button>

// Secondary button with loading state
<Button variant="secondary" loading={isLoading}>
  Generate Recipes
</Button>

// Disabled button
<Button variant="tertiary" disabled>
  Not Available
</Button>
```

**Variants:**
- `primary`: Main action button (green background)
- `secondary`: Secondary action button (outlined)
- `tertiary`: Subtle action button (minimal styling)

### Input

A styled input component with validation support.

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import Input from '@/components/Input';

<Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
/>
```

### Modal

A reusable modal component for overlays and dialogs.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}
```

**Usage:**
```tsx
import Modal from '@/components/Modal';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
  size="medium"
>
  <p>Are you sure you want to delete this recipe?</p>
  <div className="flex gap-2">
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
  </div>
</Modal>
```

## Layout Components

### MainLayout

The main application layout with navigation and content areas.

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  showMenu?: boolean;
  userName?: string;
  currentPage?: string;
}
```

**Usage:**
```tsx
import MainLayout from '@/components/layouts/MainLayout';

<MainLayout showMenu={true} userName="John Doe" currentPage="recipes">
  <div>Page content goes here</div>
</MainLayout>
```

**Features:**
- Responsive navigation menu
- User authentication state
- Active page highlighting
- Mobile-friendly design

### Nav

Navigation component with user menu and page links.

```typescript
interface NavProps {
  userName?: string;
  currentPage?: string;
  onLogout?: () => void;
}
```

**Usage:**
```tsx
import Nav from '@/components/Nav';

<Nav
  userName="John Doe"
  currentPage="recipes"
  onLogout={handleLogout}
/>
```

**Navigation Items:**
- Home
- Create Recipe
- My Recipes
- Profile
- Logout

## Authentication Components

### AuthForm

A comprehensive authentication form supporting both login and registration.

```typescript
interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}
```

**Usage:**
```tsx
import AuthForm from '@/components/auth/AuthForm';

<AuthForm
  mode="login"
  onSubmit={handleLogin}
  isLoading={isLoading}
  error={error}
/>
```

**Features:**
- Form validation with real-time feedback
- Password strength indicator (registration)
- Error handling and display
- Loading states
- Responsive design

### LoginForm

Specialized login form component.

```typescript
interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}
```

**Usage:**
```tsx
import LoginForm from '@/components/auth/LoginForm';

<LoginForm
  onSubmit={handleLogin}
  isLoading={isLoading}
  error={loginError}
/>
```

### RegisterForm

Specialized registration form component.

```typescript
interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}
```

**Usage:**
```tsx
import RegisterForm from '@/components/auth/RegisterForm';

<RegisterForm
  onSubmit={handleRegister}
  isLoading={isLoading}
  error={registerError}
/>
```

## Recipe Components

### RecipeCard

A versatile recipe card component for displaying recipe information.

```typescript
interface RecipeCardProps {
  recipe: Recipe;
  variant?: 'save' | 'my-recipes';
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipeId: string) => void;
  onShare?: (recipe: Recipe) => void;
  onRemoveFromList?: (recipeId: string) => void;
  isRemoving?: boolean;
}
```

**Usage:**
```tsx
import RecipeCard from '@/components/RecipeCard';

// Save variant (for recipe discovery)
<RecipeCard
  recipe={recipe}
  variant="save"
  onRemoveFromList={handleRemoveFromList}
/>

// My recipes variant (for user's saved recipes)
<RecipeCard
  recipe={recipe}
  variant="my-recipes"
  onEdit={handleEdit}
  onDelete={handleDelete}
  onShare={handleShare}
/>
```

**Features:**
- Recipe image with fallback placeholder
- Recipe information display
- Action buttons based on variant
- Save/unsave functionality
- Edit, delete, and share actions
- Loading and error states

### RecipeDetail

Detailed recipe view component.

```typescript
interface RecipeDetailProps {
  recipe: Recipe;
  isSaved?: boolean;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}
```

**Usage:**
```tsx
import RecipeDetail from '@/components/RecipeDetail';

<RecipeDetail
  recipe={recipe}
  isSaved={isSaved}
  onSave={handleSave}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onShare={handleShare}
/>
```

**Features:**
- Full recipe information display
- Ingredient list with quantities
- Step-by-step instructions
- Nutrition information
- Action buttons (save, edit, delete, share)
- Responsive design

### IngredientsCard

Component for displaying recipe ingredients.

```typescript
interface IngredientsCardProps {
  ingredients: Ingredient[];
  servings?: number;
  onServingsChange?: (servings: number) => void;
}
```

**Usage:**
```tsx
import IngredientsCard from '@/components/IngredientsCard';

<IngredientsCard
  ingredients={recipe.ingredients}
  servings={recipe.servings}
  onServingsChange={handleServingsChange}
/>
```

**Features:**
- Ingredient list with quantities
- Servings adjustment
- Responsive grid layout
- Interactive servings selector

## Form Components

### CreateRecipeForm

Form for creating new recipes with AI generation.

```typescript
interface CreateRecipeFormProps {
  onSubmit: (data: CreateRecipeData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}
```

**Usage:**
```tsx
import CreateRecipeForm from '@/components/forms/CreateRecipeForm';

<CreateRecipeForm
  onSubmit={handleCreateRecipe}
  isLoading={isGenerating}
  error={generationError}
/>
```

**Features:**
- Ingredient input with autocomplete
- Servings selection
- AI recipe generation
- Form validation
- Loading states

### EditRecipeForm

Form for editing existing recipes.

```typescript
interface EditRecipeFormProps {
  recipe: Recipe;
  onSubmit: (data: UpdateRecipeData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}
```

**Usage:**
```tsx
import EditRecipeForm from '@/components/forms/EditRecipeForm';

<EditRecipeForm
  recipe={recipe}
  onSubmit={handleUpdateRecipe}
  onCancel={handleCancel}
  isLoading={isUpdating}
  error={updateError}
/>
```

## Utility Components

### ErrorBoundary

Error boundary component for graceful error handling.

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

**Usage:**
```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary
  fallback={({ error, retry }) => (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={retry}>Try again</button>
    </div>
  )}
>
  <RecipeCard recipe={recipe} />
</ErrorBoundary>
```

### LoadingSpinner

Reusable loading spinner component.

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}
```

**Usage:**
```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

<LoadingSpinner size="medium" color="#96b462" />
```

### ImagePlaceholder

Placeholder component for missing recipe images.

```typescript
interface ImagePlaceholderProps {
  title: string;
  source?: string;
  className?: string;
}
```

**Usage:**
```tsx
import ImagePlaceholder from '@/components/ImagePlaceholder';

<ImagePlaceholder
  title="Chicken Curry"
  source="ai-generated"
/>
```

## Component Patterns

### Compound Components

Some components use the compound component pattern for better composition:

```tsx
// RecipeCard with sub-components
<RecipeCard recipe={recipe}>
  <RecipeCard.Image />
  <RecipeCard.Info />
  <RecipeCard.Actions />
</RecipeCard>
```

### Render Props

Components that need to provide data to children use render props:

```tsx
<ErrorBoundary>
  {(error, retry) => (
    <div>
      {error ? <ErrorMessage error={error} onRetry={retry} /> : children}
    </div>
  )}
</ErrorBoundary>
```

### Custom Hooks

Many components use custom hooks for logic separation:

```tsx
// useRecipeCard hook
const useRecipeCard = (recipe: Recipe) => {
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleSave = useCallback(() => {
    // Save logic
  }, [recipe]);
  
  return { isSaving, imageError, handleSave };
};
```

## Styling Guidelines

### Design System Integration

All components use the design system for consistent styling:

```tsx
import { colors, typography, spacingSystem } from '@/design-system';

const Button = styled.button`
  background-color: ${colors.brand.primary[500]};
  font-size: ${typography.styles.button.fontSize};
  padding: ${spacingSystem.sm} ${spacingSystem.md};
`;
```

### Responsive Design

Components are built mobile-first with responsive breakpoints:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {recipes.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} />
  ))}
</div>
```

### Accessibility

All components follow accessibility best practices:

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

## Testing Components

### Component Testing

Each component should have comprehensive tests:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Integration Testing

Test component interactions:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RecipeCard from '../RecipeCard';

describe('RecipeCard Integration', () => {
  it('should save recipe when save button is clicked', async () => {
    const mockSave = vi.fn();
    render(<RecipeCard recipe={mockRecipe} onSave={mockSave} />);
    
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(mockRecipe.id);
    });
  });
});
```

## Performance Considerations

### Memoization

Use React.memo for expensive components:

```tsx
const RecipeCard = React.memo(({ recipe, onSave }) => {
  // Component implementation
});
```

### Lazy Loading

Implement lazy loading for heavy components:

```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

### Virtual Scrolling

For large lists, implement virtual scrolling:

```tsx
import { FixedSizeList as List } from 'react-window';

<List
  height={600}
  itemCount={recipes.length}
  itemSize={200}
  itemData={recipes}
>
  {({ index, style, data }) => (
    <div style={style}>
      <RecipeCard recipe={data[index]} />
    </div>
  )}
</List>
```

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use composition patterns for flexibility
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Error Handling**: Implement proper error boundaries and fallbacks
5. **Accessibility**: Follow WCAG guidelines for accessibility
6. **Performance**: Use memoization and lazy loading appropriately
7. **Testing**: Write comprehensive tests for all components
8. **Documentation**: Document props, usage examples, and behavior
