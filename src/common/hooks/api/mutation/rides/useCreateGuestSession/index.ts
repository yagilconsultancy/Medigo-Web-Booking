import { useMutation } from '@tanstack/react-query';
import { createGuestSession } from '../../../../../services';

export const useCreateGuestSession = () => {
  return useMutation({
    mutationFn: createGuestSession,
  });
};
