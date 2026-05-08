import { useQuery } from '@tanstack/react-query';
import { publicBookingFlowConfig } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const usePublicBookingFlowConfig = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.publicBookingFlowConfig)],
    queryFn: () => publicBookingFlowConfig().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
