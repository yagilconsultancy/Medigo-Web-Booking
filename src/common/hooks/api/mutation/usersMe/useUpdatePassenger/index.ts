import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updatePassenger } from '../../../../../services';

export const useUpdatePassenger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePassenger,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listPassengers)],
      });
    },
  });
};
