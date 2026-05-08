import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateNotificationSettings } from '../../../../../services';

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getSettings)],
      });
    },
  });
};
