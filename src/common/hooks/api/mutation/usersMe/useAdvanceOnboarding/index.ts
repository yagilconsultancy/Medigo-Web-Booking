import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { advanceOnboarding } from '../../../../../services';

export const useAdvanceOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: advanceOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getOnboardingStatus)],
      });
    },
  });
};
