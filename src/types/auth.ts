// Tipos para autenticación de usuarios
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  user?: UserResponse;
  error?: string;
}
