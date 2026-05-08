import { useMutation } from '@tanstack/react-query';
import { shareRide } from '../../../../../services';

export const useShareRide = () => {
  return useMutation({
    mutationFn: shareRide,
  });
};
