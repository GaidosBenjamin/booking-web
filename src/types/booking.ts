export type BookingStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export interface BookingItem {
  camperId: string;
  tierId: string;
  roomId: string;
  price: number;
  holdExpiresAt: string | number;
}

export interface BookingResponse {
  id: string;
  amountTotal: number;
  currency: string;
  status: BookingStatus;
  checkoutUrl: string;
  items: BookingItem[];
}

export interface CreateBookingRequest {
  camperIds?: string[];
}
