export interface RoomOccupant {
  id: string;
  firstName: string;
  lastName: string;
  isLeader?: boolean;
}

export interface RoomResponse {
  id: string;
  name: string;
  capacity: number;
  imageUrl: string;
  leaderRoom: boolean;
  assignments: RoomOccupant[];
  holds: RoomOccupant[];
}

export interface HoldResponse {
  id: string;
  roomId: string;
  camperId: string;
  expiresAt: string; // ISO-8601
}

export interface CreateHoldRequest {
  camperId: string;
}
