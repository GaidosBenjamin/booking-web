import apiClient from './client';
import type { BookingResponse, CreateBookingRequest } from '../types/booking';

export async function createBooking(data?: CreateBookingRequest): Promise<BookingResponse> {
  const response = await apiClient.post<BookingResponse>('/api/bookings', data || {});
  return response.data;
}

export async function getBookings(): Promise<BookingResponse[]> {
  const response = await apiClient.get<BookingResponse[]>('/api/bookings');
  return response.data;
}

export async function getBooking(id: string): Promise<BookingResponse> {
  const response = await apiClient.get<BookingResponse>(`/api/bookings/${id}`);
  return response.data;
}

export async function cancelBooking(id: string): Promise<void> {
  await apiClient.post(`/api/bookings/${id}/cancel`);
}

export async function confirmBooking(id: string): Promise<BookingResponse> {
  const response = await apiClient.post<BookingResponse>(`/api/bookings/${id}/confirm`);
  return response.data;
}
