import { useMutation } from '@tanstack/react-query';
import { internalUpdateRideFare } from '../../../../../services';

export const useInternalUpdateRideFare = () => {
  return useMutation({
    mutationFn: internalUpdateRideFare,
  });
};
