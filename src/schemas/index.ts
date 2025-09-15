// Exportar todos los esquemas de validación
export * from "./auth";
export * from "./recipe";
export * from "./recipeGeneration";
export * from "./api";

// Esquemas comunes reutilizables
export { z } from "zod";

// Utilidades de validación
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};

export const safeValidateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
} | {
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

// Función para formatear errores de Zod
export const formatZodError = (error: z.ZodError): string[] => {
  return error.errors.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join(".")}: ` : "";
    return `${path}${err.message}`;
  });
};

// Función para obtener el primer error de Zod
export const getFirstZodError = (error: z.ZodError): string => {
  const firstError = error.errors[0];
  const path = firstError.path.length > 0 ? `${firstError.path.join(".")}: ` : "";
  return `${path}${firstError.message}`;
};
