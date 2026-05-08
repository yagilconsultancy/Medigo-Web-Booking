import { useMutation } from '@tanstack/react-query';
import { internalBatchRiderActivity } from '../../../../../services';

export const useInternalBatchRiderActivity = () => {
  return useMutation({
    mutationFn: internalBatchRiderActivity,
  });
};
