import { useMutation } from '@tanstack/react-query';
import { verifyOtp } from '../../../../../services';

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};
