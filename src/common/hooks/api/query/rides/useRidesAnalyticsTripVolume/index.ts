import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsTripVolume } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsTripVolume = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsTripVolume)],
    queryFn: () => ridesAnalyticsTripVolume().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
