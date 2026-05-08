import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createPassenger } from '../../../../../services';

export const useCreatePassenger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPassenger,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listPassengers)],
      });
    },
  });
};
