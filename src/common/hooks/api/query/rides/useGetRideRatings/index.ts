import { useQuery } from '@tanstack/react-query';
import { getRideRatings } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetRideRatings = (rideId?: string) => {
  return useQuery({
    queryKey: [rideId ? resolveRoute(ROUTES.getRideRatings, rideId) : ''],
    queryFn: () =>
      rideId ? getRideRatings(rideId).then((res) => res.data) : null,
    enabled: Boolean(rideId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
