#!/bin/bash

# 🐳 Script para producción con Docker
# Uso: ./scripts/prod-docker.sh

echo "🚀 Desplegando Chef at Home en producción..."

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Limpiar imágenes antiguas
echo "🧹 Limpiando imágenes antiguas..."
docker system prune -f

# Construir y ejecutar en modo producción
echo "🔨 Construyendo imagen de producción..."
docker-compose up --build -d

echo "✅ Aplicación desplegada en http://localhost:3000"
echo "📊 Para ver logs: docker-compose logs -f"
echo "🛑 Para detener: docker-compose down"
