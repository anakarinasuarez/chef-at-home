# Chef at Home 🍳

A modern web application for creating delicious recipes with AI. Transform
everyday ingredients into gourmet masterpieces.

## 🚀 Features

- **AI Recipe Generation**: Generate personalized recipes based on available
  ingredients
- **User Authentication**: Secure user registration and login system
- **Recipe Management**: Save, edit, and organize your favorite recipes
- **Modern UI/UX**: Elegant and responsive design with consistent design system
- **Intuitive Navigation**: Sidebar menu with quick access to all functions
- **Image Generation**: AI-powered recipe images using DALL-E
- **Multi-AI Support**: OpenAI GPT-4 with Google Gemini fallback
- **Real-time Validation**: Form validation with user-friendly error messages
- **Responsive Design**: Mobile-first approach with desktop optimization

## 📱 Navigation Structure

### For Unauthenticated Users:

- **Home**: Landing page with application information
- **Login**: User authentication
- **Signup**: New user registration

### For Authenticated Users:

- **Create Recipe** (Home): Main interface for recipe creation
- **Generated Recipes**: View AI-generated recipes
- **My Recipes**: User's saved recipes
- **Log Out**: Sign out functionality

## 🛠️ Technology Stack

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
- **Database**: SQLite with Prisma ORM ⚠️ **Not PostgreSQL**
- **Authentication**: bcryptjs + JWT
- **AI Services**: OpenAI GPT-4 + Google Gemini
- **Image Generation**: OpenAI DALL-E

> **📊 Database Note**: This project uses **SQLite**, not PostgreSQL. See
> [Database Configuration](docs/DATABASE.md) for details.

### Development Tools

- **Package Manager**: npm
- **Version Control**: Git
- **Code Formatting**: Prettier
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Database Management**: Prisma Studio

## 🏗️ Project Structure

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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- SQLite (included with Node.js)
- OpenAI API key
- Google Gemini API key (optional, for fallback)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/chef-at-home.git
   cd chef-at-home
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables:

   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   OPENAI_API_KEY="your-openai-api-key"
   GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser** Navigate to
   [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[API Documentation](docs/API.md)**: Complete API reference
- **[Architecture Guide](docs/ARCHITECTURE.md)**: Technical architecture
  overview
- **[Component Documentation](docs/COMPONENTS.md)**: React component reference
- **[State Management](docs/STATE_MANAGEMENT.md)**: Zustand store documentation
- **[Contributing Guide](docs/CONTRIBUTING.md)**: Development guidelines

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm run test -- --grep "auth"
```

### Test Coverage

- **Unit Tests**: Individual functions and components
- **Integration Tests**: API routes and service interactions
- **Component Tests**: React component behavior
- **E2E Tests**: Complete user workflows

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint:check      # Check for linting errors
npm run lint:fix        # Fix linting errors
npm run format          # Format code with Prettier
npm run type-check      # Run TypeScript type checking
npm run quality         # Run all quality checks

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio
```

## 🏛️ Architecture

### State Management

- **Zustand**: Lightweight state management
- **Domain Separation**: Each store handles a specific domain
- **Persistence**: Critical state persisted to localStorage
- **Error Handling**: Centralized error management

### Component Architecture

- **Functional Components**: React hooks-based components
- **Custom Hooks**: Reusable logic extraction
- **Error Boundaries**: Graceful error handling
- **Design System**: Consistent UI components

### API Architecture

- **Next.js API Routes**: Serverless API endpoints
- **Zod Validation**: Type-safe request validation
- **Error Handling**: Consistent error responses
- **Rate Limiting**: API protection

## 🔒 Security

- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Prisma ORM protection
- **CSRF Protection**: Built-in Next.js protection
- **Rate Limiting**: API abuse prevention

## 🚀 Deployment

### Environment Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build the application
5. Deploy to your hosting platform

### Recommended Platforms

- **Vercel**: Optimized for Next.js
- **Netlify**: Static site hosting
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS hosting

## 🤝 Contributing

We welcome contributions! Please see our
[Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- **OpenAI**: For GPT-4 and DALL-E APIs
- **Google**: For Gemini API
- **Next.js Team**: For the amazing framework
- **Vercel**: For deployment platform
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact us at support@chefathome.com

---

Made with ❤️ by the Chef at Home team
