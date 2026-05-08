import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsOverview } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsOverview = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsOverview)],
    queryFn: () => ridesAnalyticsOverview().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
