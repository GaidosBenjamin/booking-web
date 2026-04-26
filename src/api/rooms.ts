import apiClient from './client';
import type { RoomResponse, HoldResponse, CreateHoldRequest } from '../types/room';

export async function getRooms(
  gender: string,
  age: number,
  buildingId?: string
): Promise<RoomResponse[]> {
  const response = await apiClient.get<RoomResponse[]>('/api/rooms', {
    params: { gender, age, buildingId },
  });
  return response.data;
}

export async function getHolds(): Promise<HoldResponse[]> {
  const response = await apiClient.get<HoldResponse[]>('/api/rooms/holds');
  return response.data;
}

export async function createHold(roomId: string, data: CreateHoldRequest): Promise<HoldResponse> {
  const response = await apiClient.post<HoldResponse>(`/api/rooms/${roomId}/holds`, data);
  return response.data;
}

export async function deleteHold(holdId: string): Promise<void> {
  await apiClient.delete(`/api/rooms/holds/${holdId}`);
}
