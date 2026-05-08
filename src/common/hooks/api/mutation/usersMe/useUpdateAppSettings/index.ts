import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateAppSettings } from '../../../../../services';

export const useUpdateAppSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getSettings)],
      });
    },
  });
};
