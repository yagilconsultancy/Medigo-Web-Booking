import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiLoginPayload,
  ApiLoginRefreshRequest,
  ApiLoginResponse,
} from '../../../../types';

export const login = async (payload: ApiLoginPayload) => {
  return await getApiClient().post<
    ApiLoginResponse,
    AxiosResponse<ApiLoginResponse>
  >(resolveRoute(ROUTES.login), payload);
};

export const logout = async (payload: ApiLoginRefreshRequest) => {
  return await getApiClient().post<
    ApiLoginResponse,
    AxiosResponse<ApiLoginResponse>
  >(resolveRoute(ROUTES.logout), payload);
};

export const refresh = async (payload: ApiLoginRefreshRequest) => {
  return await getApiClient().post<
    ApiLoginResponse,
    AxiosResponse<ApiLoginResponse>
  >(resolveRoute(ROUTES.refresh), payload);
};
