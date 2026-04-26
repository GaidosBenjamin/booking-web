import apiClient from './client';
import type { UserResponse, UpdateUserRequest } from '../types/user';

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/api/users/me');
  return response.data;
}

export async function updateCurrentUser(data: UpdateUserRequest): Promise<UserResponse> {
  const response = await apiClient.patch<UserResponse>('/api/users/me', data);
  return response.data;
}
