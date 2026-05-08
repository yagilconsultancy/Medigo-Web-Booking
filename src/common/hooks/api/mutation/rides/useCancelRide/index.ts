import { useMutation } from '@tanstack/react-query';
import { cancelRide } from '../../../../../services';

export const useCancelRide = () => {
  return useMutation({
    mutationFn: cancelRide,
  });
};
