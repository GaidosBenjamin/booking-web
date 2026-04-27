export type BookingStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export interface BookingItem {
  roomId: string;
  price: number;
  holdExpiresAt: string;
  tier: {
    id: string;
    name: string;
    currency: string;
    basePrice: number;
    discountedPrice: number;
  };
  camper: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    grade: string;
    gender: string;
  };
}

export interface BookingResponse {
  id: string;
  amountTotal: number;
  currency: string;
  status: BookingStatus;
  checkoutUrl: string | null;
  expiresAt: string;
  items: BookingItem[];
}

export interface CreateBookingRequest {
  camperIds?: string[];
}
