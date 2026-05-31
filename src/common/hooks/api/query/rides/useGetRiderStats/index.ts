import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getRiderStats } from '../../../../../services/api';

export const useGetRiderStats = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.userRideStat)],
    queryFn: () => getRiderStats().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
