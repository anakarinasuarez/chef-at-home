# 🍳 Chef at Home - Full Stack App with Docker

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Base de Datos**: PostgreSQL
- **Cache**: Redis
- **Containerización**: Docker + Docker Compose
- **Arquitectura**: Monolito bien estructurado

## 🐳 Docker Setup

### 📋 Prerrequisitos

- Docker Desktop instalado
- Docker Compose instalado
- Git

### 🚀 Ejecutar con Docker

```bash
# 1. Clonar el repositorio
git clone <tu-repo>
cd chef-at-home

# 2. Construir y ejecutar todos los servicios
docker-compose up --build

# 3. Abrir en el navegador
open http://localhost:3000
```

### 🛠️ Comandos útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f app

# Ejecutar en segundo plano
docker-compose up -d

# Detener todos los servicios
docker-compose down

# Reconstruir solo la aplicación
docker-compose build app

# Ver estado de los contenedores
docker-compose ps
```

## 🗄️ Base de Datos

### 📊 PostgreSQL

- **Puerto**: 5432
- **Usuario**: chef_user
- **Contraseña**: chef_password
- **Base de datos**: chef_at_home

### 🔴 Redis

- **Puerto**: 6379
- **Uso**: Cache y sesiones

### 📧 Mailhog (Testing)

- **SMTP**: localhost:1025
- **Web UI**: http://localhost:8025

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   ├── auth/           # Páginas de autenticación
│   └── page.tsx        # Página principal
├── components/          # Componentes reutilizables
├── design-system/      # Sistema de diseño
├── services/           # Lógica de negocio
├── types/              # Tipos TypeScript
├── utils/              # Utilidades
└── hooks/              # Custom hooks
```

## 🔧 Desarrollo Local

### Sin Docker (desarrollo)

```bash
npm install
npm run dev
```

### Con Docker (producción)

```bash
docker-compose up --build
```

## 📱 Características

- ✅ **Autenticación completa** (registro/login)
- ✅ **Base de datos real** (PostgreSQL)
- ✅ **Sistema de diseño** profesional
- ✅ **Arquitectura limpia** y escalable
- ✅ **Containerización** con Docker
- ✅ **Responsive design** con Tailwind CSS

## 🚀 Despliegue

### Heroku

```bash
heroku container:push web
heroku container:release web
```

### Vercel

```bash
vercel --prod
```

### AWS ECS

```bash
aws ecs create-service --cluster chef-cluster --service-name chef-service
```

## 📚 Aprendizajes

Este proyecto demuestra:

- 🐳 **Docker** y containerización
- 🗄️ **Bases de datos** relacionales
- 🚀 **Arquitectura** profesional
- 🔐 **Autenticación** segura
- 🎨 **Sistemas de diseño** escalables

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Desarrollado con ❤️ usando Next.js, Docker y PostgreSQL**
