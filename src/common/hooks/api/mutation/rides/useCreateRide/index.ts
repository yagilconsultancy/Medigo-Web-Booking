import { useMutation } from '@tanstack/react-query';
import { createRide } from '../../../../../services';

export const useCreateRide = () => {
  return useMutation({
    mutationFn: createRide,
  });
};
