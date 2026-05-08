import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getMyProfile)],
    queryFn: () => getMyProfile().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
