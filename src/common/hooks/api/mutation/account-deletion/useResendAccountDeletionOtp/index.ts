import { useMutation } from '@tanstack/react-query';
import { resendAccountDeletionOtp } from '../../../../../services';

export const useResendAccountDeletionOtp = () => {
  return useMutation({
    mutationFn: resendAccountDeletionOtp,
  });
};
