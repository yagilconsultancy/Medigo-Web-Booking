import { useQuery } from '@tanstack/react-query';
import { getGuestBooking } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetGuestBooking = (rideId?: string, sessionId?: string) => {
  return useQuery({
    queryKey: [
      rideId && sessionId
        ? resolveRoute(ROUTES.getGuestBooking, rideId, sessionId)
        : '',
    ],
    queryFn: () =>
      rideId && sessionId
        ? getGuestBooking(rideId, sessionId).then((res) => res.data)
        : null,
    enabled: Boolean(rideId && sessionId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
