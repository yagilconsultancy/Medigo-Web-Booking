import { useQuery } from '@tanstack/react-query';
import { listSafetyReports } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useListSafetyReports = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listSafetyReports), params],
    queryFn: () => listSafetyReports(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
