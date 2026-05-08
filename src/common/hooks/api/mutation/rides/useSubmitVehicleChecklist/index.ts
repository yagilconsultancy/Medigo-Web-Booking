import { useMutation } from '@tanstack/react-query';
import { submitVehicleChecklist } from '../../../../../services';

export const useSubmitVehicleChecklist = () => {
  return useMutation({
    mutationFn: submitVehicleChecklist,
  });
};
