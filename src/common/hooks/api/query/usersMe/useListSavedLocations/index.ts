import { useQuery } from '@tanstack/react-query';
import { listSavedLocations } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useListSavedLocations = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listSavedLocations)],
    queryFn: () => listSavedLocations().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
