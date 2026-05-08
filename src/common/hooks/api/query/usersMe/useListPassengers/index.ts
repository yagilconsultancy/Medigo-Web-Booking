import { useQuery } from '@tanstack/react-query';
import { listPassengers } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useListPassengers = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listPassengers)],
    queryFn: () => listPassengers().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
