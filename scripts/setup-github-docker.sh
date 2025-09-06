#!/bin/bash

# Script para autenticar Docker con GitHub Container Registry

echo "🔑 Configurando Docker con GitHub Container Registry..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

echo "📋 Pasos necesarios:"
echo "1. Ve a: https://github.com/settings/tokens"
echo "2. Crea un 'Personal Access Token' con permisos 'read:packages'"
echo "3. Copia el token generado"
echo ""

read -p "Ingresa tu GitHub username: " GITHUB_USERNAME
read -s -p "Ingresa tu GitHub Personal Access Token: " GITHUB_TOKEN
echo ""

# Autenticar Docker con GitHub
echo "🔐 Autenticando Docker con GitHub..."
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin

if [ $? -eq 0 ]; then
    echo "✅ Autenticación exitosa!"
    echo ""
    echo "🚀 Ahora puedes descargar la imagen:"
    echo "docker pull ghcr.io/automatic1111/stable-diffusion-webui:latest"
    echo ""
    echo "🐳 Y ejecutar Stable Diffusion:"
    echo "docker-compose -f docker-compose.stable-diffusion-real.yml up -d"
else
    echo "❌ Error en la autenticación. Verifica tu token."
    exit 1
fi
