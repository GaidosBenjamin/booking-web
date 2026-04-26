export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  userId: string;
  tenantId: string;
}

export interface LoginRequest {
  organizationSlug: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  userId: string;
  tenantId: string;
}

export interface RegisterRequest {
  organizationSlug: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface VerifyEmailRequest {
  organizationSlug: string;
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  organizationSlug: string;
  email: string;
}

export interface ForgotPasswordRequest {
  organizationSlug: string;
  email: string;
}

export interface ResetPasswordRequest {
  organizationSlug: string;
  email: string;
  code: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
