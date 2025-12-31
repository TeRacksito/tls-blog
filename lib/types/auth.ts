export interface AuthUser {
  user: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  user: string;
  pass: string;
}

export interface LoginResponse {
  verified: boolean;
  token?: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: string;
  iat?: number;
  exp?: number;
  error?: string;
}

export const TOKEN_COOKIE_NAME = 'auth_token';
