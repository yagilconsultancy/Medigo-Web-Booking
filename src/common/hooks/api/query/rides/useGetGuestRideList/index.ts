import { useQuery } from '@tanstack/react-query';
import { guestRideList } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetGuestRideList = (sessionId?: string) => {
  return useQuery({
    queryKey: [sessionId ? resolveRoute(ROUTES.guestRideList, sessionId) : ''],
    queryFn: () =>
      sessionId ? guestRideList(sessionId).then((res) => res.data) : null,
    enabled: Boolean(sessionId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
