import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { uploadMyDocument } from '../../../../../services';

export const useUploadMyDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadMyDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listMyDocuments)],
      });
    },
  });
};
