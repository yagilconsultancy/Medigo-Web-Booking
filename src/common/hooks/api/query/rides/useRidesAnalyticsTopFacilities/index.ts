import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsTopFacilities } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsTopFacilities = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsTopFacilities)],
    queryFn: () => ridesAnalyticsTopFacilities().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
