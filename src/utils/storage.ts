/**
 * Utilidades centralizadas para manejo de localStorage y sessionStorage
 * Evita duplicación de código y proporciona manejo consistente de errores
 */

export class StorageManager {
  /**
   * Obtiene un item del localStorage de forma segura
   */
  static getItem(key: string): string | null {
    if (typeof window === "undefined") return null;

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error);
      return null;
    }
  }

  /**
   * Establece un item en localStorage de forma segura
   */
  static setItem(key: string, value: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Obtiene y parsea un objeto JSON del localStorage
   */
  static getJSON<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage ${key}:`, error);
      return null;
    }
  }

  /**
   * Guarda un objeto como JSON en localStorage
   */
  static setJSON<T>(key: string, value: T): boolean {
    try {
      const jsonString = JSON.stringify(value);
      return this.setItem(key, jsonString);
    } catch (error) {
      console.error(`Error stringifying JSON for localStorage ${key}:`, error);
      return false;
    }
  }

  /**
   * Elimina un item del localStorage
   */
  static removeItem(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
      return false;
    }
  }
}

export class SessionStorageManager {
  /**
   * Obtiene un item del sessionStorage de forma segura
   */
  static getItem(key: string): string | null {
    if (typeof window === "undefined") return null;

    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting sessionStorage item ${key}:`, error);
      return null;
    }
  }

  /**
   * Establece un item en sessionStorage de forma segura
   */
  static setItem(key: string, value: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting sessionStorage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Obtiene y parsea un objeto JSON del sessionStorage
   */
  static getJSON<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing JSON from sessionStorage ${key}:`, error);
      return null;
    }
  }

  /**
   * Guarda un objeto como JSON en sessionStorage
   */
  static setJSON<T>(key: string, value: T): boolean {
    try {
      const jsonString = JSON.stringify(value);
      return this.setItem(key, jsonString);
    } catch (error) {
      console.error(
        `Error stringifying JSON for sessionStorage ${key}:`,
        error
      );
      return false;
    }
  }

  /**
   * Elimina un item del sessionStorage
   */
  static removeItem(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing sessionStorage item ${key}:`, error);
      return false;
    }
  }
}

// Constantes para las claves de almacenamiento
export const STORAGE_KEYS = {
  CURRENT_RECIPES: "currentRecipes",
  SAVED_RECIPES: (userId: string) => `savedRecipes_${userId}`,
  RECIPE_CACHE: (recipeId: string) => `recipe-${recipeId}`,
  USER_TOKEN: "userToken",
  USER_DATA: "userData",
  EDIT_RECIPE_DATA: "editRecipeData",
} as const;
