import { useQuery } from '@tanstack/react-query';
import { getSharedRide } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetSharedRide = (shareToken?: string) => {
  return useQuery({
    queryKey: [
      shareToken ? resolveRoute(ROUTES.getSharedRide, shareToken) : '',
    ],
    queryFn: () =>
      shareToken ? getSharedRide(shareToken).then((res) => res.data) : null,
    enabled: Boolean(shareToken),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
