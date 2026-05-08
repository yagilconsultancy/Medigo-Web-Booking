import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../../../../../services';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
