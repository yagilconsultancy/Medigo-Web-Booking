import { useMutation } from '@tanstack/react-query';
import { refreshToken } from '../../../../../services';

export const useRefresh = () => {
  return useMutation({
    mutationFn: refreshToken,
  });
};
