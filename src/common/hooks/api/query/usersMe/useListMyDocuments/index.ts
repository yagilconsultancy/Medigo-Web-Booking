import { useQuery } from '@tanstack/react-query';
import { listMyDocuments } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useListMyDocuments = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listMyDocuments)],
    queryFn: () => listMyDocuments().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
