import { useMutation } from '@tanstack/react-query';
import { deleteMyProfile } from '../../../../../services';

export const useDeleteMyProfile = () => {
  return useMutation({
    mutationFn: deleteMyProfile,
  });
};
