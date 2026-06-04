import { useQuery } from '@tanstack/react-query';
import { getDriverContact } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetDriverContact = (
  rideId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getDriverContact, rideId)],
    queryFn: () => getDriverContact(rideId).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
    enabled: options?.enabled ?? Boolean(rideId),
  });
};
