#!/bin/bash

# 🐳 Script robusto para desarrollo con Docker
# Uso: ./scripts/docker-dev.sh

echo "🐳 Iniciando Chef at Home con Docker..."

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker stop $(docker ps -q --filter ancestor=chef-at-home-dev) 2>/dev/null || true
docker rm $(docker ps -aq --filter ancestor=chef-at-home-dev) 2>/dev/null || true

# Construir imagen si no existe
echo "🔨 Construyendo imagen..."
docker build -f Dockerfile.dev -t chef-at-home-dev .

# Ejecutar contenedor con volúmenes para hot reload
echo "🚀 Ejecutando contenedor..."
docker run -d \
  --name chef-at-home-dev \
  -p 3000:3000 \
  -v "$(pwd):/app" \
  -v /app/node_modules \
  -v /app/.next \
  -e NODE_ENV=development \
  -e DATABASE_URL=file:./dev.db \
  -e JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789 \
  -e JWT_EXPIRES_IN=7d \
  -e UNSPLASH_ACCESS_KEY=U6EYE-_XmRws3uia01ea6cTvNAPW4dmo1Wag984yK8U \
  -e GOOGLE_GEMINI_API_KEY=AIzaSyACgH5mKEb_jWUaAay65ZAUAwJGwEw65bg% \
  chef-at-home-dev

echo "✅ Servidor iniciado en http://localhost:3000"
echo "🔄 Hot reload activado - los cambios se reflejarán automáticamente"
echo "📊 Para ver logs: docker logs -f chef-at-home-dev"
echo "🛑 Para detener: docker stop chef-at-home-dev"

# Mostrar logs
echo "📋 Mostrando logs..."
docker logs -f chef-at-home-dev
