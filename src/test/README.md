# Testing Documentation

This directory contains comprehensive unit tests for the Chef at Home application, focusing on image generation components and hooks.

## Test Structure

### Components Tests

- **ImagePlaceholder.test.tsx**: Tests for the ImagePlaceholder component

  - Cuisine type rendering (Italian, Mexican, Asian, etc.)
  - Props handling and default values
  - Styling and accessibility
  - Edge cases and performance

- **RecipeCard.test.tsx**: Tests for the RecipeCard component
  - Image display and error handling
  - User interactions (save, edit, delete, share)
  - Authentication state handling
  - Variant-specific behavior (save vs my-recipes)

### Hooks Tests

- **useSavedRecipes.test.ts**: Tests for the useSavedRecipes hook

  - Recipe saving and removal
  - LocalStorage integration
  - State management
  - Error handling

- **useAuth.test.ts**: Tests for the useAuth hook
  - Login and registration flows
  - Authentication state management
  - API error handling
  - Token management

### API Tests

- **images-generate.test.ts**: Tests for the image generation API endpoint
  - Request validation
  - Service integration
  - Error handling
  - Edge cases

## Mock Strategy

### Third-Party Services

All external services are mocked to prevent actual API calls during testing:

- OpenAI DALL-E service
- Replicate service
- Stable Diffusion service
- Universal Cache Manager

### Context Providers

- AuthContext: Mocked with configurable user state
- Toast notifications: Mocked with showSuccess, showError, showLoading functions

### Next.js Features

- Router: Mocked navigation functions
- localStorage: Mocked storage operations

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite covers:

- ✅ Component rendering and props
- ✅ User interactions and event handling
- ✅ State management and updates
- ✅ Error handling and edge cases
- ✅ Performance considerations
- ✅ Accessibility features
- ✅ API integration points

## Key Testing Principles

1. **Isolation**: Each test is independent and doesn't rely on external state
2. **Mocking**: All third-party services are mocked to ensure fast, reliable tests
3. **Coverage**: Both positive and negative test cases are covered
4. **Performance**: Tests verify that components don't cause unnecessary re-renders
5. **Edge Cases**: Tests handle unusual inputs and error conditions

## Adding New Tests

When adding new tests:

1. Follow the existing naming convention: `ComponentName.test.tsx`
2. Include both positive and negative test cases
3. Mock all external dependencies
4. Test edge cases and error conditions
5. Verify performance characteristics
6. Update this documentation if needed
