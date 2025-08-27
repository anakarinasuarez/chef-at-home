# 🍳 Chef at Home

Una aplicación web moderna para crear y gestionar recetas de cocina con inteligencia artificial.

## 🚀 Características

- **🎨 Diseño Moderno**: Interfaz elegante con tema oscuro
- **🤖 IA Integrada**: Generación automática de recetas con IA
- **📱 Responsive**: Funciona perfectamente en todos los dispositivos
- **🔐 Autenticación**: Sistema de usuarios seguro
- **💾 Base de Datos**: PostgreSQL con Prisma ORM
- **⚡ Performance**: Optimizada con Next.js 15

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **AI**: OpenAI / Anthropic Claude
- **Containerization**: Docker & Docker Compose

## 📋 Prerrequisitos

- Node.js 18+
- Docker & Docker Compose
- Git

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd chef-at-home
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### 3. Iniciar con Docker (Recomendado)
```bash
# Desarrollo
docker-compose up -d

# O construir e iniciar manualmente
docker-compose build
docker-compose up
```

### 4. Iniciar sin Docker
```bash
npm install
npm run dev
```

## 🐳 Docker

### Desarrollo
```bash
docker-compose up -d
```

### Producción
```bash
docker build -t chef-at-home .
docker run -p 3000:3000 chef-at-home
```

## 📁 Estructura del Proyecto

```
chef-at-home/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── auth/           # Páginas de autenticación
│   │   ├── recipes/        # Páginas de recetas
│   │   └── layout.tsx      # Layout principal
│   ├── components/          # Componentes React
│   ├── hooks/              # Custom Hooks
│   ├── lib/                # Utilidades y configuraciones
│   └── types/              # Tipos TypeScript
├── prisma/                  # Esquemas de base de datos
├── public/                  # Archivos estáticos
├── Dockerfile               # Docker para producción
├── Dockerfile.dev           # Docker para desarrollo
├── docker-compose.yml       # Orquestación de servicios
└── README.md               # Este archivo
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar en producción
npm run lint         # Linting
npm run type-check   # Verificar tipos TypeScript
```

## 🌐 Variables de Entorno

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chef_at_home"

# Authentication
JWT_SECRET="your-secret-key"

# AI Services
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"

# Redis
REDIS_URL="redis://localhost:6379"
```

## 📱 Uso

1. **Registrarse/Iniciar Sesión**: Crea una cuenta o inicia sesión
2. **Crear Receta**: Ingresa ingredientes y genera recetas con IA
3. **Guardar Recetas**: Guarda tus recetas favoritas
4. **Explorar**: Descubre nuevas recetas y técnicas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación

## 🗺️ Roadmap

- [ ] Sistema de categorías de recetas
- [ ] Búsqueda avanzada
- [ ] Compartir recetas en redes sociales
- [ ] App móvil
- [ ] Integración con dispositivos IoT de cocina

---

**Desarrollado con ❤️ por el equipo de Chef at Home**
