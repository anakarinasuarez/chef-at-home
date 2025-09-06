# 🎨 Configuración de Stable Diffusion para Chef at Home

## 📋 Requisitos

- Docker Desktop instalado y funcionando
- Al menos 8GB de RAM disponible
- GPU NVIDIA (opcional, pero recomendado para mejor rendimiento)

## 🚀 Instalación Rápida

### 1. Ejecutar el script de configuración

```bash
./scripts/setup-stable-diffusion.sh
```

### 2. Iniciar Stable Diffusion

```bash
docker-compose -f docker-compose.stable-diffusion.yml up -d
```

### 3. Acceder a la interfaz web

- **Web UI**: http://localhost:7860
- **API**: http://localhost:7861

## 📥 Descargar Modelos

### Modelo Base (Recomendado)

```bash
# Crear directorio de modelos
mkdir -p stable-diffusion/models

# Descargar Stable Diffusion v1.5
wget -O stable-diffusion/models/stable-diffusion-v1-5.safetensors \
  "https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors"
```

### Modelos Especializados en Comida (Opcional)

- **Food Photography**: `food-photography-v1.safetensors`
- **Realistic Food**: `realistic-food-v2.safetensors`

## 🔧 Configuración de Variables de Entorno

Agregar a tu archivo `.env.local`:

```env
# Stable Diffusion API
NEXT_PUBLIC_STABLE_DIFFUSION_URL=http://localhost:7861
```

## 🎯 Uso en la Aplicación

### Generar Imagen de Receta

```typescript
import { stableDiffusionService } from "@/services/stableDiffusionService";

const image = await stableDiffusionService.generateRecipeImage({
  recipeName: "Pasta Carbonara",
  ingredients: ["pasta", "huevos", "queso parmesano", "panceta"],
  cuisine: "italian",
  style: "photorealistic",
});
```

### Estilos Disponibles

- `photorealistic`: Fotografía profesional de comida
- `artistic`: Ilustración artística
- `minimalist`: Presentación minimalista
- `gourmet`: Presentación de restaurante gourmet

## 🔌 API Endpoints

### Verificar Estado del Servicio

```bash
GET /api/images/generate
```

### Generar Imagen

```bash
POST /api/images/generate
Content-Type: application/json

{
  "recipeName": "Pasta Carbonara",
  "ingredients": ["pasta", "huevos", "queso"],
  "cuisine": "italian",
  "style": "photorealistic"
}
```

## 🐛 Solución de Problemas

### Error: "Service not available"

- Verificar que Docker esté corriendo
- Verificar que el contenedor esté iniciado: `docker ps`
- Verificar logs: `docker logs chef-at-home-stable-diffusion`

### Error: "Out of memory"

- Reducir `batch_size` en la configuración
- Usar CPU en lugar de GPU
- Cerrar otras aplicaciones que consuman RAM

### Imágenes de baja calidad

- Aumentar `steps` (20-30)
- Ajustar `cfg_scale` (7-12)
- Usar modelos especializados en comida

## 📊 Rendimiento

### Con GPU NVIDIA

- **Tiempo de generación**: 10-30 segundos
- **Calidad**: Alta
- **RAM requerida**: 8GB+

### Solo CPU

- **Tiempo de generación**: 2-5 minutos
- **Calidad**: Media
- **RAM requerida**: 16GB+

## 🔄 Integración Automática

El servicio se integra automáticamente con:

- ✅ Generación de recetas
- ✅ Fallback a Unsplash si no está disponible
- ✅ Cache de imágenes generadas
- ✅ Manejo de errores robusto

## 💡 Tips para Portfolio

### Prompts Efectivos

```
"Professional food photography, high resolution, appetizing, well-lit, restaurant quality, delicious looking"
```

### Estilos Recomendados

- **Portfolio**: `photorealistic` + `gourmet`
- **Blog**: `artistic` + `minimalist`
- **Redes Sociales**: `photorealistic` + colores vibrantes

### Optimización

- Generar imágenes en 512x512 para web
- Usar cache para evitar regeneración
- Implementar lazy loading para mejor UX

## 🎉 ¡Listo!

Una vez configurado, todas las recetas generadas tendrán imágenes únicas y profesionales creadas con IA, perfectas para tu portfolio.
