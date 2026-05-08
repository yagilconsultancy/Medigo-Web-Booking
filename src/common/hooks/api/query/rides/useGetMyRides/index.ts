import { useQuery } from '@tanstack/react-query';
import { getMyRides } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetMyRides = (params?: {
  status?: string | null;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getMyRides), params],
    queryFn: () => getMyRides(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
