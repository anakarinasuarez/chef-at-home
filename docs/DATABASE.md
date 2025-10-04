# Database Configuration 📊

## Database Technology

**Chef at Home** uses **SQLite** as its database, not PostgreSQL. This is
clearly configured in the project.

## Configuration Details

### Prisma Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"  // ← SQLite, not PostgreSQL
  url      = env("DATABASE_URL")
}
```

### Environment Variables

```env
# .env.local
DATABASE_URL="file:./dev.db"  # SQLite file path
```

### Database File Location

- **Development**: `prisma/dev.db`
- **Production**: Configured via `DATABASE_URL`

## Why SQLite?

### Advantages for this project:

- ✅ **Zero configuration** - No database server needed
- ✅ **File-based** - Easy to backup and version control
- ✅ **Perfect for development** - Simple setup
- ✅ **Prisma compatibility** - Works seamlessly with Prisma ORM
- ✅ **Production ready** - Can handle moderate traffic

### When to consider PostgreSQL:

- High concurrent users (>1000 simultaneous)
- Complex queries requiring advanced indexing
- Need for advanced database features (JSON columns, full-text search, etc.)
- Team prefers PostgreSQL for production

## Migration to PostgreSQL (if needed)

If you need to migrate to PostgreSQL in the future:

1. **Update schema.prisma**:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Update DATABASE_URL**:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/chef_at_home"
   ```

3. **Run migration**:
   ```bash
   npx prisma migrate dev
   ```

## Database Models

### User Model

```prisma
model User {
  id                String    @id @default(cuid())
  name              String
  email             String    @unique
  password          String
  resetToken        String?
  resetTokenExpiry  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  recipes           Recipe[]
}
```

### Recipe Model

```prisma
model Recipe {
  id           String   @id @default(cuid())
  title        String
  description  String?
  ingredients  String
  instructions String
  cookingTime  Int?
  difficulty   String?
  servings     Int?
  imageUrl     String?
  isPublic     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Database Commands

### Development

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Production

```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Important Notes

⚠️ **This project uses SQLite, not PostgreSQL**

- All documentation references SQLite
- Database file is `dev.db` in the `prisma/` directory
- No external database server required
- Perfect for development and small to medium production deployments

---

**Last updated**: January 2025 **Database**: SQLite with Prisma ORM
