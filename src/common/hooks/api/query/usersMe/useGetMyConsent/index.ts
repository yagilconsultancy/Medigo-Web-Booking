import { useQuery } from '@tanstack/react-query';
import { getMyConsent } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetMyConsent = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getMyConsent)],
    queryFn: () => getMyConsent().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
