import { useQuery } from '@tanstack/react-query';
import { getRideDetail } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetRideDetail = (rideId?: string) => {
  return useQuery({
    queryKey: [rideId ? resolveRoute(ROUTES.getRideDetail, rideId) : ''],
    queryFn: () =>
      rideId ? getRideDetail(rideId).then((res) => res.data) : null,
    enabled: Boolean(rideId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
