import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { deleteEmergencyContact } from '../../../../../services';

export const useDeleteEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmergencyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listEmergencyContacts)],
      });
    },
  });
};
