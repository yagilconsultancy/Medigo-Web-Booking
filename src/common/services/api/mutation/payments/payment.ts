import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiCreateGuestPaymentIntentPayload,
  ApiCreateGuestPaymentIntentResponse,
  ApiCreatePaymentIntentPayload,
  ApiCreatePaymentIntentResponse,
} from '../../../../types';

export const createPaymentIntent = async (
  payload: ApiCreatePaymentIntentPayload
) => {
  return await getApiClient().post<
    ApiCreatePaymentIntentResponse,
    AxiosResponse<ApiCreatePaymentIntentResponse>
  >(resolveRoute(ROUTES.createPaymentIntent), payload);
};

export const createGuestPaymentIntent = async (
  payload: ApiCreateGuestPaymentIntentPayload
) => {
  return await getApiClient().post<
    ApiCreateGuestPaymentIntentResponse,
    AxiosResponse<ApiCreateGuestPaymentIntentResponse>
  >(resolveRoute(ROUTES.guestPaymentIntent), payload);
};
