export interface SweetDto {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  username: string;
  email: string;
  role: string;
  token: string;
}

export interface User {
  username: string;
  email: string;
  role: string;
  token: string;
}

export interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}