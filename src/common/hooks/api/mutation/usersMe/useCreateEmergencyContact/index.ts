import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createEmergencyContact } from '../../../../../services';

export const useCreateEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmergencyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listEmergencyContacts)],
      });
    },
  });
};
