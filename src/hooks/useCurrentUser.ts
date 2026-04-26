import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/users';
import type { UserResponse } from '../types/user';
import { useAuth } from './useAuth';

export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserResponse>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
