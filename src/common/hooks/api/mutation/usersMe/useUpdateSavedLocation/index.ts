import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateSavedLocation } from '../../../../../services';

export const useUpdateSavedLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSavedLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listSavedLocations)],
      });
    },
  });
};
