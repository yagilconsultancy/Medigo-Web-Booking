import { useQuery } from '@tanstack/react-query';
import { healthReady } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useHealthReady = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.healthReady)],
    queryFn: () => healthReady().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
