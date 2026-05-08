import { useQuery } from '@tanstack/react-query';
import { ridesAnalyticsBookingChannels } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRidesAnalyticsBookingChannels = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridesAnalyticsBookingChannels)],
    queryFn: () => ridesAnalyticsBookingChannels().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
