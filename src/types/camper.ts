export type CamperStatus = 'NEEDS_BED' | 'NEEDS_PAYMENT' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED';
export type CamperGender = 'male' | 'female';

export interface CamperRoomHold {
  id: string;
  name: string;
  imageUrl: string;
  buildingName: string;
  holdExpiresAt: number;
}

export interface CamperRoomAssignment {
  id: string;
  name: string;
  imageUrl: string;
  buildingName: string;
  assignedOn: number;
}

export interface CamperResponse {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  grade: string;
  gender: CamperGender;
  specialRequirements: string | null;
  status: CamperStatus;
  roomsAvailable?: boolean;
  roomHold?: CamperRoomHold;
  roomAssignment?: CamperRoomAssignment;
  createdOn: string | number;
}

export interface CreateCamperRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  grade: string;
  gender: CamperGender;
  specialRequirements?: string;
}

export interface UpdateCamperRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  grade?: string;
  gender?: CamperGender;
  specialRequirements?: string;
}
