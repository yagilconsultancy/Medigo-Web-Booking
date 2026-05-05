import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { resolveTicket } from '../../../../../services';

export const useResolveTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resolveTicket,
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
