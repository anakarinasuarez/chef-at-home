#!/bin/bash

# 🐳 Script para desarrollo con Docker
# Uso: ./scripts/dev-docker.sh

echo "🐳 Iniciando Chef at Home con Docker..."

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose -f docker-compose.dev.yml down

# Limpiar imágenes antiguas (opcional)
if [ "$1" = "--clean" ]; then
    echo "🧹 Limpiando imágenes antiguas..."
    docker system prune -f
fi

# Construir y ejecutar
echo "🔨 Construyendo imagen..."
docker-compose -f docker-compose.dev.yml up --build

echo "✅ Servidor iniciado en http://localhost:3000"
echo "🔄 Hot reload activado - los cambios se reflejarán automáticamente"
echo "🛑 Para detener: Ctrl+C o ejecutar 'docker-compose -f docker-compose.dev.yml down'"
