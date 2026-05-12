import { useMutation } from '@tanstack/react-query';
import { createBaseFareEstimate } from '../../../../../services';

export const useBaseFareEstimate = () => {
  return useMutation({
    mutationFn: createBaseFareEstimate,
  });
};
