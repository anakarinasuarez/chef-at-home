# Chef at Home 🍳

Una aplicación web moderna para crear recetas deliciosas con IA. Convierte ingredientes cotidianos en obras maestras gourmet.

## 🚀 Características

- **Creación de Recetas con IA**: Genera recetas personalizadas basadas en ingredientes disponibles
- **Sistema de Autenticación**: Registro e inicio de sesión de usuarios
- **Guardado de Recetas**: Guarda tus recetas favoritas para acceder más tarde
- **Interfaz Moderna**: Diseño elegante y responsive con sistema de diseño consistente
- **Navegación Intuitiva**: Menú lateral con acceso rápido a todas las funciones

## 📱 Estructura de Navegación

### Para Usuarios No Autenticados:

- **Home**: Página de landing con información sobre la aplicación
- **Login**: Inicio de sesión
- **Signup**: Registro de nuevos usuarios

### Para Usuarios Autenticados:

- **Create Recipe** (Home): Interfaz principal para crear recetas
- **Generated Recipes**: Ver recetas generadas por IA
- **My Recipes**: Recetas guardadas por el usuario
- **Log Out**: Cerrar sesión

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Estilos**: Tailwind CSS, CSS Modules
- **Autenticación**: Context API con localStorage
- **IA**: Google Gemini API
- **Imágenes**: Unsplash API + Stable Diffusion (IA generativa)
- **Base de Datos**: Prisma con SQLite
- **Contenedores**: Docker para desarrollo y Stable Diffusion

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación
│   ├── auth/              # Páginas de autenticación
│   ├── recipes/           # Páginas de recetas
│   ├── my-recipes/        # Página de recetas guardadas
│   └── api/               # API routes
├── components/            # Componentes reutilizables
├── contexts/              # Contextos de React
├── hooks/                 # Hooks personalizados
├── services/              # Servicios de API
├── types/                 # Definiciones de tipos TypeScript
├── utils/                 # Utilidades
└── design-system/         # Sistema de diseño
```

## 🎨 Sistema de Diseño

La aplicación utiliza un sistema de diseño consistente con:

- **Colores**: Paleta de colores definida con variantes
- **Tipografía**: Sistema de fuentes con tamaños y pesos predefinidos
- **Espaciado**: Sistema de espaciado consistente
- **Componentes**: Botones, tarjetas y elementos UI reutilizables

## 🔧 Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone <repository-url>
   cd chef-at-home
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:

   ```bash
   cp .env.example .env.local
   ```

   Editar `.env.local` con tus claves de API:

   ```
   GEMINI_API_KEY=tu_clave_de_gemini
   UNSPLASH_ACCESS_KEY=tu_clave_de_unsplash
   ```

4. **Configurar la base de datos**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Ejecutar en desarrollo**:

   **Opción A: Desarrollo local**

   ```bash
   npm run dev
   ```

   **Opción B: Desarrollo con Docker (Recomendado)**

   ```bash
   # Usar el script automatizado
   ./scripts/dev-docker.sh

   # O manualmente
   docker-compose -f docker-compose.dev.yml up --build
   ```

   **Opción C: Con Stable Diffusion para imágenes IA**

   ```bash
   # Configurar Stable Diffusion
   ./scripts/setup-stable-diffusion.sh

   # Iniciar Stable Diffusion
   docker-compose -f docker-compose.stable-diffusion.yml up -d

   # Iniciar la aplicación
   npm run dev
   ```

   **Ventajas de usar Docker:**

   - ✅ Entorno aislado y consistente
   - ✅ Sin conflictos de versiones
   - ✅ Fácil configuración
   - ✅ Reproducible en cualquier máquina
   - ✅ Hot reload incluido
   - ✅ Stable Diffusion integrado para imágenes únicas

## 🚀 Uso

### Flujo Principal:

1. **Registro/Login**: Los usuarios se registran o inician sesión
2. **Crear Receta**: En el home, los usuarios agregan ingredientes y especifican comensales
3. **Generación**: La IA genera múltiples recetas basadas en los ingredientes
4. **Guardar**: Los usuarios pueden guardar sus recetas favoritas
5. **Acceder**: Las recetas guardadas están disponibles en "My Recipes"

### Funcionalidades del Menú:

- **Create Recipe**: Navega al home para crear nuevas recetas
- **Generated Recipes**: Ver recetas generadas recientemente
- **My Recipes**: Acceder a recetas guardadas y gestionarlas
- **Log Out**: Cerrar sesión y volver a la página de landing

## 📊 Estado de la Aplicación

- **Autenticación**: ✅ Implementada con Context API
- **Creación de Recetas**: ✅ Integración con Gemini AI
- **Guardado de Recetas**: ✅ Sistema de favoritos con localStorage
- **Navegación**: ✅ Menú lateral con estado activo
- **Notificaciones**: ✅ Sistema de notificaciones global
- **Responsive**: ✅ Diseño adaptativo para móviles y desktop

## 🎨 Stable Diffusion Integration

Esta aplicación incluye integración con **Stable Diffusion** para generar imágenes únicas de recetas usando IA:

- **Imágenes Personalizadas**: Cada receta tiene una imagen generada específicamente
- **Múltiples Estilos**: Fotorealístico, artístico, minimalista, gourmet
- **Fallback Inteligente**: Si Stable Diffusion no está disponible, usa Unsplash
- **API REST**: Endpoint dedicado para generación de imágenes
- **Docker Ready**: Configuración completa con Docker

Ver [STABLE_DIFFUSION_SETUP.md](./STABLE_DIFFUSION_SETUP.md) para configuración detallada.

## 🔮 Próximas Mejoras

- [x] Integración con Stable Diffusion para imágenes IA
- [ ] Sistema de categorías de recetas
- [ ] Filtros y búsqueda avanzada
- [ ] Compartir recetas
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Testing automatizado
- [ ] CI/CD pipeline

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍🍳 Autor

**Chef at Home Team**

---

¡Disfruta creando deliciosas recetas con IA! 🍽️
