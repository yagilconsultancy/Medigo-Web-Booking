import { useMutation } from '@tanstack/react-query';
import { deactivateRecurringRide } from '../../../../../services';

export const useDeactivateRecurringRide = () => {
  return useMutation({
    mutationFn: deactivateRecurringRide,
  });
};
