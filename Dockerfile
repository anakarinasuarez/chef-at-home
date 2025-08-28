# 🐳 Dockerfile para Chef at Home
# Usamos Node.js 18 Alpine (más ligero y seguro)

# Etapa 1: Construcción (Build Stage)
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar todo el código fuente
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Construir la aplicación Next.js
RUN npm run build

# Etapa 2: Producción (Production Stage)
FROM node:18-alpine AS runner

# Establecer directorio de trabajo
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Cambiar propietario de los archivos
RUN chown -R nextjs:nodejs /app

# Cambiar al usuario no-root
USER nextjs

# Exponer puerto 3000
EXPOSE 3000

# Variable de entorno para el puerto
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
