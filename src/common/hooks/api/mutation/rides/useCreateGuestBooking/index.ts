import { useMutation } from '@tanstack/react-query';
import { createGuestBooking } from '../../../../../services';

export const useCreateGuestBooking = () => {
  return useMutation({
    mutationFn: createGuestBooking,
  });
};
