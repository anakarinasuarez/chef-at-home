/**
 * Tipos comunes utilizados en toda la aplicación
 * Centraliza las definiciones de tipos para evitar duplicación
 */

import { Recipe } from "./recipe";

// Tipo para usuario básico
export interface BasicUser {
  id: string;
  name: string;
  email: string;
}

// Tipo para receta básica (para componentes UI)
export interface RecipeCardData {
  id?: string;
  title: string;
  servings: number;
  cookingTime: string;
  image?: string;
  source: string;
  difficulty?: string;
}

// Tipo para ingrediente
export interface Ingredient {
  id: string;
  name: string;
}

// Tipo para receta completa (con ingredientes e instrucciones)
export interface FullRecipe {
  id?: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookingTime: string;
  totalTime?: string;
  servings: number;
  cuisine?: string;
  image?: string;
  source?: string;
}

// Tipo para respuesta de API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Tipo para error de API
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Tipo para estado de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Tipo para paginación
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
