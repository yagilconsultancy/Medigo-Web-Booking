import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateMyProfile } from '../../../../../services';

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getMyProfile)],
      });
    },
  });
};
