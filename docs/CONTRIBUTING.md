# Contributing Guidelines

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Documentation Standards](#documentation-standards)
- [Issue Reporting](#issue-reporting)

## Getting Started

Thank you for your interest in contributing to Chef at Home! This guide will help you get started with contributing to the project.

### Prerequisites

- Node.js 18+ and npm
- Git
- PostgreSQL (for local development)
- VS Code (recommended) with ESLint and Prettier extensions

### Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/chef-at-home.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see [Environment Setup](#environment-setup))
5. Run the development server: `npm run dev`

## Development Setup

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chef_at_home"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"

# Environment
NODE_ENV="development"
```

### Database Setup

1. Install PostgreSQL locally
2. Create a database: `createdb chef_at_home`
3. Run migrations: `npx prisma migrate dev`
4. Seed the database: `npx prisma db seed`

### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint:check

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Run all quality checks
npm run quality

# Build for production
npm run build
```

## Code Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type usage
- Use strict type checking

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Bad
const user: any = { id: 1, name: "John" };
```

### React Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for component props
- Follow React best practices

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

// Bad
const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

### State Management Guidelines

- Use Zustand for global state
- Keep state minimal and focused
- Use selectors for component subscriptions
- Implement proper error handling

```typescript
// Good
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.login({ email, password });
          if (result.success) {
            set({ user: result.user, isLoading: false });
            return true;
          } else {
            set({ error: result.error, isLoading: false });
            return false;
          }
        } catch (error) {
          set({ error: 'Login failed', isLoading: false });
          return false;
        }
      },
    }),
    { name: 'auth-storage' }
  )
);
```

### File Organization

- Use kebab-case for file names
- Group related files in folders
- Use index files for clean imports
- Follow the established folder structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthForm.tsx
│   │   ├── LoginForm.tsx
│   │   └── index.ts
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── index.ts
├── services/
│   ├── authService.ts
│   ├── recipeService.ts
│   └── index.ts
└── types/
    ├── auth.ts
    ├── recipe.ts
    └── index.ts
```

## Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test improvements

Examples:
- `feature/user-profile-page`
- `fix/recipe-image-upload`
- `refactor/auth-service-structure`

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(auth): add user registration functionality

fix(recipes): resolve image upload issue

docs(api): update authentication endpoint documentation
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following code standards
3. Write tests for new functionality
4. Update documentation if needed
5. Run quality checks: `npm run quality`
6. Create a pull request with a clear description

## Testing Guidelines

### Test Structure

- Write unit tests for all new functions
- Write integration tests for API routes
- Write component tests for UI components
- Maintain test coverage above 80%

### Test Examples

#### Unit Test
```typescript
import { describe, it, expect, vi } from 'vitest';
import { authService } from '../authService';

describe('authService', () => {
  it('should validate email format', () => {
    const validEmail = 'user@example.com';
    const invalidEmail = 'invalid-email';
    
    expect(authService.validateEmail(validEmail)).toBe(true);
    expect(authService.validateEmail(invalidEmail)).toBe(false);
  });
});
```

#### Component Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### API Test
```typescript
import { describe, it, expect } from 'vitest';
import { POST } from '../api/auth/login/route';

describe('/api/auth/login', () => {
  it('should return 400 for invalid email', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid', password: 'password' }),
    });
    
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

### Test Coverage

Run coverage reports:
```bash
npm run test:coverage
```

Maintain coverage above 80% for:
- Services
- Utilities
- Components
- API routes

## Pull Request Process

### Before Submitting

1. **Code Quality**: Run `npm run quality` and fix all issues
2. **Tests**: Ensure all tests pass and coverage is maintained
3. **Documentation**: Update relevant documentation
4. **Self Review**: Review your own code before submitting

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and quality checks
2. **Code Review**: At least one team member reviews the code
3. **Testing**: Manual testing in staging environment
4. **Approval**: Maintainer approves and merges the PR

## Documentation Standards

### Code Documentation

- Use JSDoc for functions and classes
- Document complex algorithms and business logic
- Include examples for public APIs
- Keep documentation up-to-date with code changes

```typescript
/**
 * Generates AI-powered recipes based on ingredients and preferences
 * @param ingredients - Array of ingredient names
 * @param servings - Number of servings for the recipe
 * @param preferences - Optional dietary preferences
 * @returns Promise resolving to generated recipes
 * @throws {ValidationError} When ingredients array is empty
 * @example
 * ```typescript
 * const recipes = await generateRecipes(
 *   ['chicken', 'rice', 'vegetables'],
 *   4,
 *   { dietary: 'keto' }
 * );
 * ```
 */
async function generateRecipes(
  ingredients: string[],
  servings: number,
  preferences?: RecipePreferences
): Promise<Recipe[]> {
  // Implementation
}
```

### README Updates

- Update README when adding new features
- Include setup instructions for new dependencies
- Document new environment variables
- Update API documentation

### Architecture Documentation

- Document architectural decisions
- Update system diagrams when needed
- Explain design patterns used
- Document performance considerations

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Safari, Firefox]
- Version: [e.g., 1.0.0]

## Additional Context
Any other context about the problem
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other context or screenshots
```

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or inappropriate comments
- Personal attacks or political discussions
- Public or private harassment
- Publishing private information without permission
- Other unprofessional conduct

## Getting Help

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord for real-time help

## Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to Chef at Home! 🍳
