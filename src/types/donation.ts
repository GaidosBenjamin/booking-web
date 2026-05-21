export type DonationStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export interface DonationResponse {
  id: string;
  amount: number;
  currency: string;
  checkoutUrl: string | null;
  status: DonationStatus;
}

export interface CreateDonationRequest {
  amount: number;
  currency: string;
  name?: string;
  email?: string;
  orgSlug: string;
}
