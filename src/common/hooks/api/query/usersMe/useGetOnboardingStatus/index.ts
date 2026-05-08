import { useQuery } from '@tanstack/react-query';
import { getOnboardingStatus } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetOnboardingStatus = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getOnboardingStatus)],
    queryFn: () => getOnboardingStatus().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
