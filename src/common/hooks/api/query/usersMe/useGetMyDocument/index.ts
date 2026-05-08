import { useQuery } from '@tanstack/react-query';
import { getMyDocument } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useGetMyDocument = (documentId?: string) => {
  return useQuery({
    queryKey: [
      documentId ? resolveRoute(ROUTES.getMyDocument, documentId) : '',
    ],
    queryFn: () =>
      documentId ? getMyDocument(documentId).then((res) => res.data) : null,
    enabled: Boolean(documentId),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
