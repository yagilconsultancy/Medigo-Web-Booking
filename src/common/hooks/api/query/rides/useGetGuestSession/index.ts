import { useQuery } from '@tanstack/react-query';
import { getGuestSession } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetGuestSession = (sessionId?: string) => {
  return useQuery({
    queryKey: [
      sessionId ? resolveRoute(ROUTES.getGuestSession, sessionId) : '',
    ],
    queryFn: () =>
      sessionId ? getGuestSession(sessionId).then((res) => res.data) : null,
    enabled: Boolean(sessionId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
