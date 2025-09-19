// Exportar todos los esquemas de validación
export * from "./auth";
export * from "./recipe";
export * from "./recipeGeneration";
export * from "./api";

// Esquemas comunes reutilizables
import { z } from "zod";
export { z };

// Utilidades de validación
export const safeValidateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: z.ZodError;
    } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
};

// Función para obtener el primer error de Zod
export const getFirstZodError = (error: z.ZodError): string => {
  const firstError = error.errors[0];
  const path =
    firstError.path.length > 0 ? `${firstError.path.join(".")}: ` : "";
  return `${path}${firstError.message}`;
};
