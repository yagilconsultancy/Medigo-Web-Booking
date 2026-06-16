import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetMyProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getMyProfile)],
    queryFn: () => getMyProfile().then((res) => res.data),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
