import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsTopFleetPartners } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsTopFleetPartners = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsTopFleetPartners)],
    queryFn: () => ridesAnalyticsTopFleetPartners().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
