import { useMutation } from '@tanstack/react-query';
import { requestAccountDeletion } from '../../../../../services';

export const useRequestAccountDeletion = () => {
  return useMutation({
    mutationFn: requestAccountDeletion,
  });
};
