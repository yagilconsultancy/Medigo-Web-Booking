import { useQuery } from '@tanstack/react-query';
import { getRideTimeline } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetRideTimeline = (rideId?: string) => {
  return useQuery({
    queryKey: [rideId ? resolveRoute(ROUTES.getRideTimeline, rideId) : ''],
    queryFn: () =>
      rideId ? getRideTimeline(rideId).then((res) => res.data) : null,
    enabled: Boolean(rideId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
