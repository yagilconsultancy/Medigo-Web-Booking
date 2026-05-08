import { useQuery } from '@tanstack/react-query';
import { getSavedLocation } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetSavedLocation = (locationId?: string) => {
  return useQuery({
    queryKey: [
      locationId ? resolveRoute(ROUTES.getSavedLocation, locationId) : '',
    ],
    queryFn: () =>
      locationId ? getSavedLocation(locationId).then((res) => res.data) : null,
    enabled: Boolean(locationId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
