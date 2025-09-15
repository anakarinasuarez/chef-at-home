import { z } from "zod";

// Esquema para respuestas de API exitosas
export const apiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
});

// Esquema para respuestas de API con error
export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

// Esquema para respuestas de API (éxito o error)
export const apiResponseSchema = z.union([apiSuccessSchema, apiErrorSchema]);

// Esquema para paginación
export const paginationSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1").default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be less than 100")
    .default(10),
  total: z.number().int().min(0, "Total cannot be negative").optional(),
  totalPages: z
    .number()
    .int()
    .min(0, "Total pages cannot be negative")
    .optional(),
});

// Esquema para respuestas paginadas
export const paginatedResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(z.any()),
  pagination: paginationSchema,
  message: z.string().optional(),
});

// Esquema para parámetros de query
export const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, "Page must be a positive number"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine(
      (val) => !isNaN(val) && val > 0 && val <= 100,
      "Limit must be between 1 and 100"
    ),
  sort: z
    .string()
    .max(50, "Sort field must be less than 50 characters")
    .optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Esquema para parámetros de ruta
export const routeParamsSchema = z.object({
  id: z
    .string()
    .min(1, "ID is required")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "ID can only contain letters, numbers, hyphens, and underscores"
    ),
});

// Esquema para headers de autenticación
export const authHeadersSchema = z.object({
  authorization: z
    .string()
    .min(1, "Authorization header is required")
    .regex(/^Bearer\s+.+/, "Authorization header must start with 'Bearer '"),
});

// Esquema para validación de archivos
export const fileUploadSchema = z.object({
  filename: z
    .string()
    .min(1, "Filename is required")
    .max(255, "Filename must be less than 255 characters"),
  mimetype: z
    .string()
    .min(1, "MIME type is required")
    .regex(
      /^image\/(jpeg|jpg|png|gif|webp)$/,
      "File must be a valid image format"
    ),
  size: z
    .number()
    .int()
    .min(1, "File size must be at least 1 byte")
    .max(5 * 1024 * 1024, "File size must be less than 5MB"), // 5MB max
});

// Tipos TypeScript inferidos
export type ApiSuccessResponse = z.infer<typeof apiSuccessSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;
export type RouteParams = z.infer<typeof routeParamsSchema>;
export type AuthHeaders = z.infer<typeof authHeadersSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
