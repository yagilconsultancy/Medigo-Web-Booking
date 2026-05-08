import { useMutation } from '@tanstack/react-query';
import { createRecurringRide } from '../../../../../services';

export const useCreateRecurringRide = () => {
  return useMutation({
    mutationFn: createRecurringRide,
  });
};
