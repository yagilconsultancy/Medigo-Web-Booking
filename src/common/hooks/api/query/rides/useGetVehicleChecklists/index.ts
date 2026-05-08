import { useQuery } from '@tanstack/react-query';
import { getVehicleChecklists } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetVehicleChecklists = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getVehicleChecklists)],
    queryFn: () => getVehicleChecklists().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
