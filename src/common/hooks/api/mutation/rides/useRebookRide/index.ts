import { useMutation } from '@tanstack/react-query';
import { rebookRide } from '../../../../../services';

export const useRebookRide = () => {
  return useMutation({
    mutationFn: rebookRide,
  });
};
