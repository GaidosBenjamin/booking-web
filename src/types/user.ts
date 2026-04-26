export interface UserResponse {
  userId: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  member: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}
