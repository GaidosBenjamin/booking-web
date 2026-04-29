import apiClient from './client';
import type { DonationResponse, CreateDonationRequest } from '../types/donation';

export async function createDonation(data: CreateDonationRequest): Promise<DonationResponse> {
  const response = await apiClient.post<DonationResponse>('/api/donations', data);
  return response.data;
}

export async function getDonation(id: string): Promise<DonationResponse> {
  const response = await apiClient.get<DonationResponse>(`/api/donations/${id}`);
  return response.data;
}
