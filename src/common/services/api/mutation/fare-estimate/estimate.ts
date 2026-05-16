import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiBaseFareEstimateRequest,
  ApiBaseFareEstimateResponse,
  ApiFareEstimateRequest,
} from '../../../../types';

export const createFareEstimate = async (payload: ApiFareEstimateRequest) => {
  return await getApiClient().post<any, AxiosResponse<any>>(
    resolveRoute(ROUTES.riderFareEstimate),
    payload
  );
};

export const createBaseFareEstimate = async (
  payload: ApiBaseFareEstimateRequest
) => {
  return await getApiClient().post<
    ApiBaseFareEstimateResponse,
    AxiosResponse<ApiBaseFareEstimateResponse>
  >(resolveRoute(ROUTES.riderBaseFareEstimate), payload);
};
