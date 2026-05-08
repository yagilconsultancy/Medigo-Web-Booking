import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsServiceQuality } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsServiceQuality = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsServiceQuality)],
    queryFn: () => ridesAnalyticsServiceQuality().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
