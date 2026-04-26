import apiClient from './client';
import type { BuildingResponse } from '../types/building';

export async function getBuildings(gender: string, age: number): Promise<BuildingResponse[]> {
  const response = await apiClient.get<BuildingResponse[]>('/api/buildings', {
    params: { gender, age },
  });
  return response.data;
}
