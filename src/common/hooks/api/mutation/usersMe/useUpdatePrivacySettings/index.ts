import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updatePrivacySettings } from '../../../../../services';

export const useUpdatePrivacySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrivacySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getSettings)],
      });
    },
  });
};
