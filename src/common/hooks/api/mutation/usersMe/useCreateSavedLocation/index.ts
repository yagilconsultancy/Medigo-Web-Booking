import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createSavedLocation } from '../../../../../services';

export const useCreateSavedLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSavedLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listSavedLocations)],
      });
    },
  });
};
