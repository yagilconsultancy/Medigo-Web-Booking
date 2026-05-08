import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateMyConsent } from '../../../../../services';

export const useUpdateMyConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyConsent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getMyConsent)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getMyProfile)],
      });
    },
  });
};
