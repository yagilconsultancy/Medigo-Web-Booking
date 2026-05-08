import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { deletePassenger } from '../../../../../services';

export const useDeletePassenger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePassenger,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listPassengers)],
      });
    },
  });
};
