import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { deleteSavedLocation } from '../../../../../services';

export const useDeleteSavedLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSavedLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listSavedLocations)],
      });
    },
  });
};
