import { useMutation } from '@tanstack/react-query';
import { register } from '../../../../../services';

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};
