import apiClient from './client';
import type { CodeOfConductResponse, AgreementResponse, CreateAgreementRequest } from '../types/coc';

export async function getCodeOfConduct(): Promise<CodeOfConductResponse[]> {
  const response = await apiClient.get<CodeOfConductResponse[]>('/api/code-of-conduct');
  return response.data;
}

export async function getAgreements(): Promise<AgreementResponse[]> {
  const response = await apiClient.get<AgreementResponse[]>('/api/code-of-conduct/agreements');
  return response.data;
}

export async function createAgreement(data: CreateAgreementRequest): Promise<AgreementResponse> {
  const response = await apiClient.post<AgreementResponse>('/api/code-of-conduct/agreements', data);
  return response.data;
}
