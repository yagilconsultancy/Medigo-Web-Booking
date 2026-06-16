import { useMutation } from '@tanstack/react-query';
import { createGuestPaymentIntent } from '../../../../../services';

export const useCreateGuestPaymentIntent = () => {
  return useMutation({
    mutationFn: createGuestPaymentIntent,
  });
};
