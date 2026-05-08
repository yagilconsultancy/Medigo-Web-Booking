import { useQuery } from '@tanstack/react-query';
import { healthLive } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useHealthLive = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.healthLive)],
    queryFn: () => healthLive().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
