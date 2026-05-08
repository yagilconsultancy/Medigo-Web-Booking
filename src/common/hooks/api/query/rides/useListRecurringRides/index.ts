import { useQuery } from '@tanstack/react-query';
import { listRecurringRides } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useListRecurringRides = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listRecurringRides)],
    queryFn: () => listRecurringRides().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
