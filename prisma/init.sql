-- 🗄️ Script de inicialización para PostgreSQL
-- Se ejecuta automáticamente cuando se crea el contenedor

-- Crear la base de datos si no existe
SELECT 'CREATE DATABASE chef_at_home'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'chef_at_home')\gexec

-- Conectar a la base de datos
\c chef_at_home;

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON "Recipe"(userId);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON "Recipe"("createdAt");

-- Comentarios para documentar la base de datos
COMMENT ON DATABASE chef_at_home IS 'Base de datos para la aplicación Chef at Home';
COMMENT ON TABLE "User" IS 'Usuarios registrados en la aplicación';
COMMENT ON TABLE "Recipe" IS 'Recetas creadas por los usuarios';
