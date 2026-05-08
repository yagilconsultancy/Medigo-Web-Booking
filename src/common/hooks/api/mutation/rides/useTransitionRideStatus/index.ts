import { useMutation } from '@tanstack/react-query';
import { transitionRideStatus } from '../../../../../services';

export const useTransitionRideStatus = () => {
  return useMutation({
    mutationFn: transitionRideStatus,
  });
};
