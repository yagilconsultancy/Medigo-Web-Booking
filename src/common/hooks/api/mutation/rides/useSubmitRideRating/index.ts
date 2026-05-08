import { useMutation } from '@tanstack/react-query';
import { submitRideRating } from '../../../../../services';

export const useSubmitRideRating = () => {
  return useMutation({
    mutationFn: submitRideRating,
  });
};
