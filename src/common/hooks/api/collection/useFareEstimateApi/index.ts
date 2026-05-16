import { toast } from 'sonner';
import { useBaseFareEstimate, useFareEstimate } from '../../mutation';
import type {
  ApiBaseFareEstimateRequest,
  ApiBaseFareEstimateResponse,
  ApiFareEstimateRequest,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useFareEstimateApi = () => {
  const doBaseFareEstimate = useBaseFareEstimate();
  const doFareEstimate = useFareEstimate();

  const createFareEstimate = async (
    payload: ApiFareEstimateRequest
  ): Promise<any> => {
    let success: boolean = null;
    let data: any = {};

    await tryExecute(
      () => doFareEstimate.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          data = responseData;
          success = true;
          //   toast.success('');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the fare estimate');
      }
    );
    return { success, data };
  };

  const createBaseFareEstimate = async (
    payload: ApiBaseFareEstimateRequest
  ): Promise<ApiBaseFareEstimateResponse> => {
    let result: ApiBaseFareEstimateResponse = null;
    await tryExecute(
      () => doBaseFareEstimate.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          result = responseData;
          //   toast.success('Base fare estimate created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the base fare estimate');
      }
    );
    return result;
  };

  return {
    createFareEstimate,
    createBaseFareEstimate,
  };
};
