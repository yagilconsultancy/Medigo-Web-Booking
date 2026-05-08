import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsTransportDistribution } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsTransportDistribution = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsTransportDistribution)],
    queryFn: () =>
      ridesAnalyticsTransportDistribution().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
