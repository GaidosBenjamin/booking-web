import apiClient from './client';
import type { CamperResponse, CreateCamperRequest, UpdateCamperRequest } from '../types/camper';

export async function getCampers(): Promise<CamperResponse[]> {
  const response = await apiClient.get<CamperResponse[]>('/api/campers');
  return response.data;
}

export async function createCamper(data: CreateCamperRequest): Promise<CamperResponse> {
  const response = await apiClient.post<CamperResponse>('/api/campers', data);
  return response.data;
}

export async function updateCamper(id: string, data: UpdateCamperRequest): Promise<CamperResponse> {
  const response = await apiClient.patch<CamperResponse>(`/api/campers/${id}`, data);
  return response.data;
}

export async function deleteCamper(id: string): Promise<void> {
  await apiClient.delete(`/api/campers/${id}`);
}
