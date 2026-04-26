export interface TierResponse {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  discountPrice: number;
  currency: string;
  memberDiscount: boolean;
  createdOn: string;
}

export interface BuildingResponse {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  tier: TierResponse;
  isFull?: boolean;
  createdOn: string;
}
