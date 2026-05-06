import { useMutation } from '@tanstack/react-query';
import { createPaymentIntent } from '../../../../../services';

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: createPaymentIntent,
  });
};
