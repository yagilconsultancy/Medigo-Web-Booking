import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsTripStatus } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsTripStatus = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsTripStatus)],
    queryFn: () => ridesAnalyticsTripStatus().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
