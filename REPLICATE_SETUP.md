# 🎨 Configuración de Replicate para Stable Diffusion

## ¿Qué es Replicate?

Replicate es un servicio en la nube que ejecuta modelos de IA, incluyendo Stable Diffusion. Es más confiable que configurar Docker localmente.

## 🚀 Configuración Rápida

### 1. Crear cuenta en Replicate

1. Ve a: https://replicate.com
2. Crea una cuenta gratuita
3. Ve a: https://replicate.com/account/api-tokens
4. Crea un nuevo token API

### 2. Configurar variables de entorno

Agrega a tu archivo `.env.local`:

```env
REPLICATE_API_TOKEN=tu_token_aqui
```

### 3. Probar la configuración

```bash
# Verificar que el servicio esté disponible
curl http://localhost:3000/api/images/generate
```

## 💰 Costos

- **Gratis**: 1,000 minutos por mes
- **Pago**: $0.000231 por segundo de GPU
- **Estimación**: ~$0.01 por imagen generada

## 🎯 Ventajas de Replicate

✅ **Sin configuración Docker** compleja
✅ **Sin problemas de GitHub Container Registry**
✅ **Modelos siempre actualizados**
✅ **Escalabilidad automática**
✅ **API confiable**
✅ **Perfecto para portfolio**

## 🔧 Uso en la Aplicación

El servicio se integra automáticamente:

1. **Primero intenta Replicate** (servicio en la nube)
2. **Si falla, usa servicio local** (si está configurado)
3. **Si todo falla, usa mock** (para desarrollo)

## 📊 Verificación

### Con Replicate funcionando:

```json
{
  "serviceAvailable": true,
  "models": ["stability-ai/stable-diffusion"],
  "message": "Replicate service is running"
}
```

### Sin Replicate:

```json
{
  "serviceAvailable": false,
  "models": [],
  "message": "Stable Diffusion service is not available"
}
```

## 🎉 ¡Listo!

Una vez configurado, todas las recetas tendrán imágenes reales generadas con Stable Diffusion en la nube.
