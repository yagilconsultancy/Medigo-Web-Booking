import { useQuery } from '@tanstack/react-query';
import { getRideFare } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetRideFare = (rideId?: string) => {
  return useQuery({
    queryKey: [rideId ? resolveRoute(ROUTES.getRideFare, rideId) : ''],
    queryFn: () =>
      rideId ? getRideFare(rideId).then((res) => res.data) : null,
    enabled: Boolean(rideId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
