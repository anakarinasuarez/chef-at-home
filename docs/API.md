# API Documentation

## Overview

Chef at Home uses Next.js API routes to handle backend functionality. This document provides comprehensive information about all internal API endpoints, their parameters, responses, and usage.

## Authentication Endpoints

### POST `/api/auth/login`

Authenticates a user with email and password.

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
// Success (200)
{
  message: "Login successful";
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (400/401)
{
  error: string;
  details?: string;
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### POST `/api/auth/register`

Registers a new user account.

**Request Body:**
```typescript
{
  name: string;
  email: string;
  password: string;
}
```

**Response:**
```typescript
// Success (201)
{
  message: "User successfully registered";
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (400)
{
  error: string;
  details?: string;
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## Recipe Endpoints

### POST `/api/recipes/generate`

Generates AI-powered recipes based on ingredients and servings.

**Request Body:**
```typescript
{
  ingredients: string[];
  servings: number;
  count?: number; // Optional, defaults to 4
}
```

**Response:**
```typescript
// Success (200)
{
  recipes: Array<{
    id: string;
    title: string;
    description: string;
    ingredients: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
    instructions: string[];
    cookingTime: string;
    servings: number;
    difficulty: "easy" | "medium" | "hard";
    image?: string;
    source: string;
    nutrition?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }>;
}

// Error (400/500)
{
  error: string;
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/recipes/generate \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["chicken","rice","vegetables"],"servings":4,"count":3}'
```

### GET `/api/recipes`

Retrieves public recipes with optional filtering.

**Query Parameters:**
- `limit`: number (optional, defaults to 10)
- `offset`: number (optional, defaults to 0)
- `difficulty`: "easy" | "medium" | "hard" (optional)
- `cuisine`: string (optional)

**Response:**
```typescript
// Success (200)
{
  recipes: Array<{
    id: string;
    title: string;
    description: string;
    ingredients: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
    instructions: string[];
    cookingTime: string;
    servings: number;
    difficulty: "easy" | "medium" | "hard";
    image?: string;
    source: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  hasMore: boolean;
}
```

**Example:**
```bash
curl "http://localhost:3000/api/recipes?limit=5&difficulty=easy"
```

### GET `/api/recipes/[id]`

Retrieves a specific recipe by ID.

**Path Parameters:**
- `id`: string (recipe ID)

**Response:**
```typescript
// Success (200)
{
  recipe: {
    id: string;
    title: string;
    description: string;
    ingredients: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
    instructions: string[];
    cookingTime: string;
    servings: number;
    difficulty: "easy" | "medium" | "hard";
    image?: string;
    source: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    createdAt: Date;
    updatedAt: Date;
  };
}

// Error (404)
{
  error: "Recipe not found";
}
```

**Example:**
```bash
curl "http://localhost:3000/api/recipes/recipe-123"
```

## Error Handling

All API endpoints follow a consistent error response format:

```typescript
{
  error: string;
  details?: string;
  code?: string;
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

API endpoints are protected by rate limiting to prevent abuse:
- **Authentication endpoints**: 5 requests per minute per IP
- **Recipe generation**: 10 requests per hour per user
- **General endpoints**: 100 requests per minute per IP

## Authentication

Most endpoints require authentication via session cookies or JWT tokens. Include authentication headers when making authenticated requests:

```bash
curl -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/recipes
```

## Validation

All input data is validated using Zod schemas. Common validation rules:

- **Email**: Must be a valid email format
- **Password**: Minimum 6 characters
- **Recipe title**: 3-200 characters
- **Ingredients**: Array of 1-50 ingredients
- **Servings**: Integer between 1-50

## Caching

API responses are cached for performance:
- **Recipe data**: 1 hour cache
- **User data**: 30 minutes cache
- **Generated recipes**: No cache (always fresh)

## Testing

API endpoints can be tested using the provided test suite:

```bash
# Run API tests
npm run test:api

# Run specific endpoint tests
npm run test:api -- --grep "auth"
```

## Development

To add new API endpoints:

1. Create route file in `src/app/api/[endpoint]/route.ts`
2. Implement HTTP methods (GET, POST, PUT, DELETE)
3. Add validation using Zod schemas
4. Write tests in `src/app/api/[endpoint]/__tests__/`
5. Update this documentation

## Security Considerations

- All user inputs are sanitized
- SQL injection protection via Prisma ORM
- CSRF protection enabled
- Rate limiting implemented
- Authentication required for sensitive operations
- Input validation on all endpoints
