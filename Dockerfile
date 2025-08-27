# Dockerfile para Chef at Home - Next.js 15
FROM node:18-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
# Verificar https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine para entender por qué libc6-compat podría ser necesario.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependencias basadas en el archivo de lock preferido
# Ver https://yarnpkg.com/advanced/lockfile#toc.yarn.lock
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar la aplicación Next.js
RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Descomentar la siguiente línea en caso de que quieras deshabilitar telemetría durante el tiempo de ejecución.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Establecer el propietario correcto para la aplicación next
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar la aplicación construida
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js es creado por next build desde la configuración standalone
# en next.config.js
CMD ["node", "server.js"]
