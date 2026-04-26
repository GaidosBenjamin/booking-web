import apiClient from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LogoutRequest,
} from '../types/auth';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<void> {
  await apiClient.post('/api/auth/register', data);
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<void> {
  await apiClient.post('/api/auth/verify-email', data);
}

export async function resendVerification(data: ResendVerificationRequest): Promise<void> {
  await apiClient.post('/api/auth/verify-email/resend', data);
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await apiClient.post('/api/auth/forgot-password', data);
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/api/auth/reset-password', data);
}

export async function logout(data: LogoutRequest): Promise<void> {
  await apiClient.post('/api/auth/logout', data);
}
