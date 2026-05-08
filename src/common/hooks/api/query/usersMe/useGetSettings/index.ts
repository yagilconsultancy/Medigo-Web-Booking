import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetSettings = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getSettings)],
    queryFn: () => getSettings().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
