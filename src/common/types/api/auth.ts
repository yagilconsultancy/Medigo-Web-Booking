import { ApiResponse } from './common';

export type ApiLoginPayload = {
  email: string;
  password: string;
};

export type ApiLoginRefreshRequest = {
  refresh_token: string;
};

export type ApiAuthTokenPair = {
  access_token: string;
  refresh_token: string;
};

export type ApiLoginResponse = ApiResponse<ApiAuthTokenPair>;
