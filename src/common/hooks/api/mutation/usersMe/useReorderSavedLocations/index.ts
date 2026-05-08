import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { reorderSavedLocations } from '../../../../../services';

export const useReorderSavedLocations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderSavedLocations,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listSavedLocations)],
      });
    },
  });
};
