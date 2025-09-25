# 🛠️ Configuración de Desarrollo - Chef at Home

Esta guía explica cómo configurar el entorno de desarrollo para trabajar en el
proyecto Chef at Home.

## 📋 Prerrequisitos

- **Node.js**: v20.10.0 o superior
- **npm**: v10.2.3 o superior
- **VS Code** (recomendado) con las extensiones sugeridas

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus claves de API:

```env
GEMINI_API_KEY=tu_clave_de_gemini
OPENAI_API_KEY=tu_clave_de_openai
UNSPLASH_ACCESS_KEY=tu_clave_de_unsplash
```

### 3. Configurar Base de Datos

```bash
npx prisma generate
npx prisma db push
```

## 🎨 Herramientas de Desarrollo

### ESLint - Linting de Código

ESLint está configurado con reglas específicas para:

- **TypeScript**: Validación de tipos y mejores prácticas
- **React**: Reglas específicas para componentes React
- **React Hooks**: Validación de reglas de hooks
- **Accesibilidad**: Reglas jsx-a11y para accesibilidad web
- **Importaciones**: Organización y detección de imports no utilizados

#### Comandos ESLint:

```bash
# Verificar problemas de linting
npm run lint:check

# Arreglar problemas automáticamente
npm run lint:fix

# Arreglar todos los problemas (sin warnings)
npm run lint:fix-all
```

### Prettier - Formateo de Código

Prettier está configurado para mantener consistencia en el estilo del código.

#### Comandos Prettier:

```bash
# Verificar formato
npm run format:check

# Formatear código
npm run format
```

### TypeScript - Verificación de Tipos

```bash
# Verificar tipos sin compilar
npm run type-check
```

## 🔧 Scripts Disponibles

| Script                  | Descripción                       |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Iniciar servidor de desarrollo    |
| `npm run build`         | Construir para producción         |
| `npm run start`         | Iniciar servidor de producción    |
| `npm run lint`          | Linting con Next.js               |
| `npm run lint:check`    | Verificar problemas ESLint        |
| `npm run lint:fix`      | Arreglar problemas ESLint         |
| `npm run format`        | Formatear con Prettier            |
| `npm run format:check`  | Verificar formato                 |
| `npm run type-check`    | Verificar tipos TypeScript        |
| `npm run test`          | Ejecutar tests                    |
| `npm run test:ui`       | Ejecutar tests con UI             |
| `npm run test:run`      | Ejecutar tests una vez            |
| `npm run test:coverage` | Ejecutar tests con cobertura      |
| `npm run quality`       | Ejecutar todas las verificaciones |

## 🎯 Flujo de Trabajo Recomendado

### 1. Antes de Empezar a Codificar

```bash
# Verificar que todo esté funcionando
npm run quality
```

### 2. Durante el Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# En otra terminal, ejecutar tests en modo watch
npm run test
```

### 3. Antes de Commit

```bash
# Ejecutar todas las verificaciones
npm run quality

# Si hay problemas de formato, arreglarlos
npm run format
npm run lint:fix
```

## 🔍 Configuración de VS Code

El proyecto incluye configuración automática para VS Code:

### Extensiones Recomendadas

- **Prettier**: Formateo automático
- **ESLint**: Linting en tiempo real
- **Tailwind CSS IntelliSense**: Autocompletado para Tailwind
- **TypeScript Importer**: Importaciones automáticas
- **Path Intellisense**: Autocompletado de rutas

### Configuración Automática

- **Formateo al guardar**: Habilitado
- **Fix ESLint al guardar**: Habilitado
- **Organizar imports**: Habilitado
- **Exclusión de archivos**: `.next`, `node_modules`, etc.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas (Next.js App Router)
├── components/            # Componentes reutilizables
│   ├── __tests__/        # Tests de componentes
│   ├── auth/             # Componentes de autenticación
│   ├── layouts/          # Layouts
│   ├── lazy/             # Lazy loading
│   └── ui/               # Componentes UI básicos
├── design-system/         # Sistema de diseño
├── hooks/                 # Custom hooks
├── services/             # Lógica de negocio
├── stores/               # Estado global (Zustand)
├── schemas/              # Validaciones (Zod)
├── types/                # Tipos TypeScript
└── utils/                # Utilidades
```

## 🧪 Testing

El proyecto usa **Vitest** con **React Testing Library**:

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con UI interactiva
npm run test:ui

# Ejecutar tests una vez (para CI)
npm run test:run

# Ejecutar tests con cobertura
npm run test:coverage
```

## 🚨 Solución de Problemas

### Error de TypeScript Version

Si ves el warning sobre la versión de TypeScript:

```
WARNING: You are currently running a version of TypeScript which is not officially supported
```

Esto es normal y no afecta la funcionalidad. El proyecto usa TypeScript 5.9.2
que es más reciente que la versión oficialmente soportada por ESLint.

### Problemas de ESLint

Si ESLint no funciona correctamente:

1. Verificar que las extensiones estén instaladas
2. Reiniciar VS Code
3. Ejecutar `npm run lint:check` para ver errores específicos

### Problemas de Prettier

Si Prettier no formatea correctamente:

1. Verificar que la extensión esté instalada
2. Verificar que `.prettierrc` esté en la raíz del proyecto
3. Ejecutar `npm run format` manualmente

## 📚 Recursos Adicionales

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

¡Happy Coding! 🚀
