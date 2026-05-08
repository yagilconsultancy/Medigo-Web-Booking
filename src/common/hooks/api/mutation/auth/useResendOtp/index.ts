import { useMutation } from '@tanstack/react-query';
import { resendOtp } from '../../../../../services';

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
  });
};
