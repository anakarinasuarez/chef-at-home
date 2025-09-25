import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Configuración base de Next.js
  ...compat.extends('next/core-web-vitals'),

  // Configuración global
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.mjs',
      'coverage/**',
      'prisma/**',
      '**/.next/**',
      '**/node_modules/**',
    ],
  },

  // Configuración específica para archivos de configuración
  {
    files: ['*.config.js', '*.config.mjs', '*.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // Configuración específica para archivos de test
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      'no-console': 'off',
    },
  },
];

export default eslintConfig;
