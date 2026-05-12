import { useMutation } from '@tanstack/react-query';
import { createFareEstimate } from '../../../../../services';

export const useFareEstimate = () => {
  return useMutation({
    mutationFn: createFareEstimate,
  });
};
