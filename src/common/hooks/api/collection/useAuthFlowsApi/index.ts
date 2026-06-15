import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  useChangePassword,
  useForgotPassword,
  useLogin,
  useLogout,
  useRefresh,
  useRegister,
  useResendOtp,
  useResetPassword,
  useVerifyOtp,
} from '../../mutation';
import type {
  ApiChangePasswordPayload,
  ApiForgotPasswordPayload,
  ApiLoginPayload,
  ApiRefreshTokenPayload,
  ApiRegisterPayload,
  ApiResendOtpPayload,
  ApiResetPasswordPayload,
  ApiVerifyOtpPayload,
} from '../../../../types';
import {
  REGISTER_ACCOUNT_KEY,
  REGISTER_USER_ID_KEY,
} from '../../../../constants';
import {
  extractApiErrorMessage,
  extractResponseErrors,
  tryExecute,
} from '../../../../utils';

export const useAuthFlowsApi = () => {
  const router = useRouter();
  const doRegister = useRegister();
  const doVerifyOtp = useVerifyOtp();
  const doResendOtp = useResendOtp();
  const doLogin = useLogin();
  const doRefresh = useRefresh();
  const doLogout = useLogout();
  const doChangePassword = useChangePassword();
  const doForgotPassword = useForgotPassword();
  const doResetPassword = useResetPassword();

  const register = async (
    payload: ApiRegisterPayload,
    options?: { accountType?: string }
  ) => {
    return await tryExecute(
      () => doRegister.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          const data = responseData.data;
          const userId = data?.user_id;

          if (userId && typeof window !== 'undefined') {
            sessionStorage.setItem(REGISTER_USER_ID_KEY, userId);
            if (options?.accountType) {
              sessionStorage.setItem(REGISTER_ACCOUNT_KEY, options.accountType);
            }
            router.push(
              `/otp?purpose=registration${
                options?.accountType ? `&account=${options.accountType}` : ''
              }`
            );
          }

          return data;
        }
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async (error) => {
        const responseData = error?.response?.data;
        if (responseData) {
          toast.error(extractResponseErrors(responseData));
          return null;
        }

        toast.error(extractApiErrorMessage(error));
        return null;
      }
    );
  };

  const verifyOtp = async (payload: ApiVerifyOtpPayload) => {
    return await tryExecute(
      () => doVerifyOtp.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return null;
      }
    );
  };

  const resendOtp = async (payload: ApiResendOtpPayload) => {
    return await tryExecute(
      () => doResendOtp.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return true;
        toast.error(extractResponseErrors(responseData));
        return false;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return false;
      }
    );
  };

  const login = async (payload: ApiLoginPayload) => {
    return await tryExecute(
      () => doLogin.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return null;
      }
    );
  };

  const refreshToken = async (payload: ApiRefreshTokenPayload) => {
    return await tryExecute(
      () => doRefresh.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return null;
      }
    );
  };

  const logout = async (payload: ApiRefreshTokenPayload) => {
    return await tryExecute(
      () => doLogout.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return true;
        toast.error(extractResponseErrors(responseData));
        return false;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return false;
      }
    );
  };

  const changePassword = async (payload: ApiChangePasswordPayload) => {
    return await tryExecute(
      () => doChangePassword.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          toast.success('Password changed successfully');
          return true;
        }
        toast.error(extractResponseErrors(responseData));
        return false;
      },
      async (error: any) => {
        toast.error(
          extractApiErrorMessage(
            error,
            error?.response?.status === 401
              ? 'Current password is incorrect'
              : 'An error occurred while changing password'
          )
        );
        return false;
      }
    );
  };

  const forgotPassword = async (payload: ApiForgotPasswordPayload) => {
    return await tryExecute(
      () => doForgotPassword.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return true;
        toast.error(extractResponseErrors(responseData));
        return false;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return false;
      }
    );
  };

  const resetPassword = async (payload: ApiResetPasswordPayload) => {
    return await tryExecute(
      () => doResetPassword.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return true;
        toast.error(extractResponseErrors(responseData));
        return false;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return false;
      }
    );
  };

  return {
    register,
    verifyOtp,
    resendOtp,
    login,
    refreshToken,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    isRegistering: doRegister.isPending,
    isVerifyingOtp: doVerifyOtp.isPending,
    isResendingOtp: doResendOtp.isPending,
    isLoggingIn: doLogin.isPending,
    isRefreshingToken: doRefresh.isPending,
    isLoggingOut: doLogout.isPending,
    isChangingPassword: doChangePassword.isPending,
    isRequestingPasswordReset: doForgotPassword.isPending,
    isResettingPassword: doResetPassword.isPending,
  };
};
