import { useQuery } from '@tanstack/react-query';
import { getMyActiveRide } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetMyActiveRide = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getMyActiveRide)],
    queryFn: () => getMyActiveRide().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
