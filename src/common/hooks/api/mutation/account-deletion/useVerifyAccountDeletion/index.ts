import { useMutation } from '@tanstack/react-query';
import { verifyAccountDeletion } from '../../../../../services';

export const useVerifyAccountDeletion = () => {
  return useMutation({
    mutationFn: verifyAccountDeletion,
  });
};
