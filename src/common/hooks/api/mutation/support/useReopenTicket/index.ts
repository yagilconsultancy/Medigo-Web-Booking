import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { reopenTicket } from '../../../../../services';

export const useReopenTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reopenTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getSupportKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listSupportTickets)],
      });
    },
  });
};
