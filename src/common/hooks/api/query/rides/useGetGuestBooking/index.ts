import { useQuery } from '@tanstack/react-query';
import { getGuestBooking } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetGuestBooking = (rideId?: string) => {
  return useQuery({
    queryKey: [rideId ? resolveRoute(ROUTES.getGuestBooking, rideId) : ''],
    queryFn: () =>
      rideId ? getGuestBooking(rideId).then((res) => res.data) : null,
    enabled: Boolean(rideId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
