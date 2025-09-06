#!/bin/bash

# Script para configurar Stable Diffusion con Docker
# Para el proyecto Chef at Home

echo "🍳 Configurando Stable Diffusion para Chef at Home..."

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p stable-diffusion/{models,outputs,config,extensions}

# Crear red de Docker si no existe
echo "🌐 Creando red de Docker..."
docker network create chef-at-home-network 2>/dev/null || echo "Red ya existe"

# Descargar modelo base (opcional - se puede hacer desde la UI)
echo "📥 Descargando modelo base..."
if [ ! -f "stable-diffusion/models/stable-diffusion-v1-5.safetensors" ]; then
    echo "⚠️  Modelo no encontrado. Descárgalo manualmente desde:"
    echo "   https://huggingface.co/runwayml/stable-diffusion-v1-5"
    echo "   Colócalo en: stable-diffusion/models/"
fi

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Verificar GPU (opcional)
if command -v nvidia-smi &> /dev/null; then
    echo "🎮 GPU NVIDIA detectada"
else
    echo "💻 Usando CPU (más lento pero funcional)"
fi

echo "✅ Configuración completada!"
echo ""
echo "🚀 Para iniciar Stable Diffusion:"
echo "   docker-compose -f docker-compose.stable-diffusion.yml up -d"
echo ""
echo "🌐 Accede a la interfaz web en:"
echo "   http://localhost:7860"
echo ""
echo "🔌 API disponible en:"
echo "   http://localhost:7861"
