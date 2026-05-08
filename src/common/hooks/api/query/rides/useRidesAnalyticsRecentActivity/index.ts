import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsRecentActivity } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsRecentActivity = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsRecentActivity)],
    queryFn: () => ridesAnalyticsRecentActivity().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
