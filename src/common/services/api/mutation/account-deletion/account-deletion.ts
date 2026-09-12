import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiRequestAccountDeletionPayload,
  ApiRequestAccountDeletionResponse,
  ApiResendAccountDeletionOtpPayload,
  ApiVerifyAccountDeletionPayload,
  ApiVerifyAccountDeletionResponse,
} from '../../../../types';

export const requestAccountDeletion = async (
  payload: ApiRequestAccountDeletionPayload
) => {
  return await getApiClient().post<
    ApiRequestAccountDeletionResponse,
    AxiosResponse<ApiRequestAccountDeletionResponse>,
    ApiRequestAccountDeletionPayload
  >(resolveRoute(ROUTES.requestAccountDeletion), payload);
};

export const verifyAccountDeletion = async (
  payload: ApiVerifyAccountDeletionPayload
) => {
  return await getApiClient().post<
    ApiVerifyAccountDeletionResponse,
    AxiosResponse<ApiVerifyAccountDeletionResponse>,
    ApiVerifyAccountDeletionPayload
  >(resolveRoute(ROUTES.verifyAccountDeletion), payload);
};

export const resendAccountDeletionOtp = async (
  payload: ApiResendAccountDeletionOtpPayload
) => {
  return await getApiClient().post<
    ApiRequestAccountDeletionResponse,
    AxiosResponse<ApiRequestAccountDeletionResponse>,
    ApiResendAccountDeletionOtpPayload
  >(resolveRoute(ROUTES.resendAccountDeletionOtp), payload);
};
