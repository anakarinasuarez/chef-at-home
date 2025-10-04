# Technical Architecture Documentation

## Overview

Chef at Home is a modern web application built with Next.js 14, TypeScript, and
Zustand for state management. This document outlines the technical architecture,
design patterns, and system components.

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **State Management**: Zustand
- **UI Components**: Custom component library
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

### Backend

- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: bcryptjs + JWT
- **AI Services**: OpenAI GPT-4 + Google Gemini
- **Image Generation**: OpenAI DALL-E

### Development Tools

- **Package Manager**: npm
- **Version Control**: Git
- **Code Formatting**: Prettier
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Project Structure

```
chef-at-home/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Authentication pages
│   │   ├── create/            # Recipe creation page
│   │   ├── my-recipes/        # User recipes page
│   │   ├── recipes/           # Recipe pages
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── layouts/           # Layout components
│   │   ├── pages/             # Page components
│   │   └── ui/                # UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── schemas/               # Zod validation schemas
│   ├── services/              # Business logic services
│   ├── stores/                # Zustand state stores
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── docs/                      # Documentation
├── prisma/                    # Database schema and migrations
└── public/                    # Static assets
```

## Architecture Patterns

### 1. Domain-Driven Design (DDD)

The application is organized around business domains:

- **Authentication Domain**: User management, login, registration
- **Recipe Domain**: Recipe creation, management, generation
- **User Domain**: User preferences, saved recipes
- **AI Domain**: Recipe generation, image creation

### 2. Service Layer Pattern

Business logic is encapsulated in service classes:

```typescript
// Example: AuthService
class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Business logic here
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Business logic here
  }
}
```

### 3. Repository Pattern

Data access is abstracted through repository interfaces:

```typescript
// Example: RecipeRepository
interface RecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  create(recipe: CreateRecipeData): Promise<Recipe>;
  update(id: string, data: Partial<Recipe>): Promise<Recipe>;
  delete(id: string): Promise<void>;
}
```

## State Management Architecture

### Zustand Store Structure

The application uses Zustand for state management with the following stores:

#### 1. AuthStore

```typescript
interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
```

#### 2. RecipesStore

```typescript
interface RecipesState {
  recipes: UnifiedRecipe[];
  isLoading: boolean;
  error: string | null;
  generateRecipes: (ingredients: string[], servings: number) => Promise<void>;
  addRecipe: (recipe: UnifiedRecipe) => void;
  removeRecipe: (recipeId: string) => void;
}
```

#### 3. SavedRecipesStore

```typescript
interface SavedRecipesState {
  savedRecipes: FrontendRecipe[];
  isLoading: boolean;
  error: string | null;
  saveRecipe: (recipe: FrontendRecipe, userId: string) => boolean;
  removeRecipe: (recipeId: string, userId: string) => boolean;
  updateRecipe: (
    recipeId: string,
    updatedRecipe: FrontendRecipe,
    userId: string
  ) => boolean;
}
```

### Store Design Principles

1. **Single Responsibility**: Each store handles one domain
2. **Immutable Updates**: State updates are immutable
3. **Selective Subscriptions**: Components subscribe only to needed state
4. **Persistence**: Critical state is persisted to localStorage
5. **Error Handling**: Centralized error state management

## Component Architecture

### Component Hierarchy

```
App
├── MainLayout
│   ├── Nav
│   ├── ErrorBoundary
│   └── PageContent
│       ├── RecipeCard
│       ├── RecipeDetail
│       ├── CreateRecipeForm
│       └── AuthForm
```

### Component Design Patterns

#### 1. Compound Components

```typescript
// RecipeCard with sub-components
<RecipeCard>
  <RecipeCard.Image />
  <RecipeCard.Info />
  <RecipeCard.Actions />
</RecipeCard>
```

#### 2. Render Props Pattern

```typescript
// ErrorBoundary with render prop
<ErrorBoundary>
  {(error, retry) => (
    <div>
      {error ? <ErrorMessage error={error} onRetry={retry} /> : children}
    </div>
  )}
</ErrorBoundary>
```

#### 3. Custom Hooks

```typescript
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

## Data Flow Architecture

### 1. User Authentication Flow

```
User Input → AuthForm → AuthService → API Route → AuthBackendService → Database
                ↓
            AuthStore → UI Update
```

### 2. Recipe Generation Flow

```
User Input → CreateRecipePage → RecipeGenerationService → AI Service → API Response
                ↓
            RecipesStore → UI Update
```

### 3. Recipe Management Flow

```
User Action → RecipeCard → SavedRecipesStore → LocalStorage → UI Update
```

## Database Architecture

### Entity Relationship Diagram

```
User
├── id (PK)
├── name
├── email
├── password
├── createdAt
└── updatedAt

Recipe
├── id (PK)
├── title
├── description
├── ingredients (JSON)
├── instructions (JSON)
├── cookingTime
├── servings
├── difficulty
├── imageUrl
├── userId (FK)
├── isPublic
├── createdAt
└── updatedAt
```

### Database Design Principles

1. **Normalization**: Properly normalized to reduce redundancy
2. **Indexing**: Strategic indexes on frequently queried fields
3. **Constraints**: Foreign key constraints for data integrity
4. **Migrations**: Version-controlled schema changes
5. **Seeding**: Development data seeding

## Security Architecture

### Authentication & Authorization

1. **Password Hashing**: bcryptjs with salt rounds
2. **Session Management**: JWT tokens with expiration
3. **CSRF Protection**: Built-in Next.js CSRF protection
4. **Input Validation**: Zod schemas for all inputs
5. **SQL Injection Prevention**: Prisma ORM parameterized queries

### Data Protection

1. **Environment Variables**: Sensitive data in environment variables
2. **API Rate Limiting**: Prevents abuse and DoS attacks
3. **Input Sanitization**: All user inputs are sanitized
4. **Error Handling**: Secure error messages without sensitive data

## Performance Architecture

### Frontend Optimization

1. **Code Splitting**: Dynamic imports for route-based splitting
2. **Image Optimization**: Next.js Image component with optimization
3. **Caching**: Browser caching for static assets
4. **Lazy Loading**: Components loaded on demand
5. **Memoization**: React.memo and useMemo for expensive operations

### Backend Optimization

1. **Database Indexing**: Optimized database queries
2. **Response Caching**: API response caching
3. **Connection Pooling**: Database connection pooling
4. **Compression**: Gzip compression for responses
5. **CDN**: Static asset delivery via CDN

## Error Handling Architecture

### Error Boundary System

```typescript
// Global error boundary
<ErrorBoundaryAdvanced level="app">
  <App />
</ErrorBoundaryAdvanced>

// Component-level error boundary
<ErrorBoundaryAdvanced level="component">
  <RecipeCard />
</ErrorBoundaryAdvanced>
```

### Error Types

1. **Validation Errors**: Input validation failures
2. **Authentication Errors**: Login/registration failures
3. **Network Errors**: API communication failures
4. **Database Errors**: Data persistence failures
5. **AI Service Errors**: External service failures

## Testing Architecture

### Test Pyramid

```
E2E Tests (Cypress)
    ↑
Integration Tests (API Routes)
    ↑
Unit Tests (Components, Services, Utils)
```

### Testing Strategy

1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: API routes and service interactions
3. **E2E Tests**: Complete user workflows
4. **Visual Tests**: Component visual regression testing
5. **Performance Tests**: Load and performance testing

## Deployment Architecture

### Environment Configuration

- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live application environment

### CI/CD Pipeline

1. **Code Quality**: ESLint, Prettier, TypeScript checks
2. **Testing**: Automated test suite execution
3. **Build**: Production build generation
4. **Deploy**: Automated deployment to hosting platform
5. **Monitoring**: Application monitoring and alerting

## Monitoring & Observability

### Logging Strategy

1. **Application Logs**: Structured logging with context
2. **Error Tracking**: Centralized error collection
3. **Performance Metrics**: Response times and throughput
4. **User Analytics**: User behavior and engagement metrics

### Health Checks

1. **Database Connectivity**: Database connection health
2. **External Services**: AI service availability
3. **API Endpoints**: Endpoint response health
4. **System Resources**: Memory and CPU usage

## Scalability Considerations

### Horizontal Scaling

1. **Stateless Design**: No server-side session storage
2. **Database Scaling**: Read replicas and connection pooling
3. **CDN Integration**: Global content delivery
4. **Microservices**: Potential service decomposition

### Performance Monitoring

1. **Real User Monitoring**: Actual user experience metrics
2. **Synthetic Monitoring**: Automated health checks
3. **Performance Budgets**: Performance regression prevention
4. **Capacity Planning**: Resource usage forecasting
