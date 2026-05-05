import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getUserProfile)],
    queryFn: () => getUserProfile().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
