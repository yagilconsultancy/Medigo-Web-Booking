import { useMutation } from '@tanstack/react-query';
import { login } from '../../../../../services';

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
