import { ApiResponse } from './common';

export type ApiStandardResponse<T = any> = ApiResponse<T>;

export type ApiTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
  role: string;
};

export type ApiRegisterPayload = {
  email?: string | null;
  phone?: string | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  password: string;
  role?: 'admin' | 'business' | 'driver' | 'rider' | 'facility';
};

export type ApiRegisterResponseData = {
  user_id: string; // uuid
  message?: string;
};

export type ApiVerifyOtpPayload = {
  user_id: string; // uuid
  code: string; // 6 chars
  purpose?: string; // default: registration
};

export type ApiOtpVerifyResponseData = {
  verified?: boolean;
  message?: string;
};

export type ApiLoginPayload = {
  email?: string | null;
  phone?: string | null;
  password: string;
};

export type ApiRefreshTokenPayload = {
  refresh_token: string;
};

export type ApiLogoutPayload = ApiRefreshTokenPayload;

export type ApiChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

export type ApiResendOtpPayload = {
  user_id: string;
  purpose?: string;
};

export type ApiForgotPasswordPayload = {
  email?: string | null;
  phone?: string | null;
};

export type ApiResetPasswordPayload = {
  token: string;
  new_password: string;
};

export type ApiRegisterResponse = ApiStandardResponse<ApiRegisterResponseData>;
export type ApiVerifyOtpResponse =
  ApiStandardResponse<ApiOtpVerifyResponseData>;
export type ApiLoginResponse = ApiStandardResponse<ApiTokenResponse>;
export type ApiRefreshTokenResponse = ApiStandardResponse<ApiTokenResponse>;
export type ApiLogoutResponse = ApiStandardResponse<any>;
export type ApiChangePasswordResponse = ApiStandardResponse<any>;
export type ApiResendOtpResponse = ApiStandardResponse<any>;
export type ApiForgotPasswordResponse = ApiStandardResponse<any>;
export type ApiResetPasswordResponse = ApiStandardResponse<any>;
