import { useMutation } from '@tanstack/react-query';
import { refresh } from '../../../../../services';

export const useRefresh = () => {
  return useMutation({
    mutationFn: refresh,
  });
};
