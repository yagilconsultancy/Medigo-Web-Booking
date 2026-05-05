import { useQuery } from '@tanstack/react-query';

// Stub hook - implement properly when user profile API is available
export const useGetUserProfileInfo = (payload?: { userId?: string }) => {
  return useQuery({
    queryKey: ['userProfileInfo', payload?.userId],
    queryFn: async () => null,
    enabled: false, // Disabled until API is implemented
  });
};
