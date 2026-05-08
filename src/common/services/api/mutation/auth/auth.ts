import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiChangePasswordPayload,
  ApiChangePasswordResponse,
  ApiForgotPasswordPayload,
  ApiForgotPasswordResponse,
  ApiLoginPayload,
  ApiLoginResponse,
  ApiLogoutPayload,
  ApiLogoutResponse,
  ApiRefreshTokenPayload,
  ApiRefreshTokenResponse,
  ApiRegisterPayload,
  ApiRegisterResponse,
  ApiResendOtpPayload,
  ApiResendOtpResponse,
  ApiResetPasswordPayload,
  ApiResetPasswordResponse,
  ApiVerifyOtpPayload,
  ApiVerifyOtpResponse,
} from '../../../../types';

export const register = async (payload: ApiRegisterPayload) => {
  return await getApiClient().post<
    ApiRegisterResponse,
    AxiosResponse<ApiRegisterResponse>
  >(resolveRoute(ROUTES.register), payload);
};

export const verifyOtp = async (payload: ApiVerifyOtpPayload) => {
  return await getApiClient().post<
    ApiVerifyOtpResponse,
    AxiosResponse<ApiVerifyOtpResponse>
  >(resolveRoute(ROUTES.verifyOtp), payload);
};

export const resendOtp = async (payload: ApiResendOtpPayload) => {
  const { user_id, purpose } = payload;
  return await getApiClient().post<
    ApiResendOtpResponse,
    AxiosResponse<ApiResendOtpResponse>
  >(resolveRoute(ROUTES.resendOtp), undefined, {
    params: { user_id, purpose },
  });
};

export const login = async (payload: ApiLoginPayload) => {
  return await getApiClient().post<
    ApiLoginResponse,
    AxiosResponse<ApiLoginResponse>
  >(resolveRoute(ROUTES.login), payload);
};

export const refreshToken = async (payload: ApiRefreshTokenPayload) => {
  return await getApiClient().post<
    ApiRefreshTokenResponse,
    AxiosResponse<ApiRefreshTokenResponse>
  >(resolveRoute(ROUTES.refresh), payload);
};

export const logout = async (payload: ApiLogoutPayload) => {
  return await getApiClient().post<
    ApiLogoutResponse,
    AxiosResponse<ApiLogoutResponse>
  >(resolveRoute(ROUTES.logout), payload);
};

export const changePassword = async (payload: ApiChangePasswordPayload) => {
  return await getApiClient().post<
    ApiChangePasswordResponse,
    AxiosResponse<ApiChangePasswordResponse>
  >(resolveRoute(ROUTES.changePassword), payload);
};

export const forgotPassword = async (payload: ApiForgotPasswordPayload) => {
  return await getApiClient().post<
    ApiForgotPasswordResponse,
    AxiosResponse<ApiForgotPasswordResponse>
  >(resolveRoute(ROUTES.forgotPassword), payload);
};

export const resetPassword = async (payload: ApiResetPasswordPayload) => {
  return await getApiClient().post<
    ApiResetPasswordResponse,
    AxiosResponse<ApiResetPasswordResponse>
  >(resolveRoute(ROUTES.resetPassword), payload);
};
