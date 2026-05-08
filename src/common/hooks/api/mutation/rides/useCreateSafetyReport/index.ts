import { useMutation } from '@tanstack/react-query';
import { createSafetyReport } from '../../../../../services';

export const useCreateSafetyReport = () => {
  return useMutation({
    mutationFn: createSafetyReport,
  });
};
