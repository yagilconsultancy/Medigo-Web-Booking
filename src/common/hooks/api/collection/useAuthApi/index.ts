import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLogin, useLogout, useRefresh } from '../../mutation';
import { ApiLoginPayload, ApiRefreshTokenPayload } from '../../../../types';
import {
  extractApiErrorMessage,
  extractResponseErrors,
  setAuthToken,
  setRefreshToken,
  tryExecute,
} from '../../../../utils';
import Cookies from 'js-cookie';
import {
  REGISTER_ACCOUNT_KEY,
  REGISTER_USER_ID_KEY,
} from '../../../../constants';

export const useAuthApi = () => {
  const doLogin = useLogin();
  const router = useRouter();
  const doLogout = useLogout();
  const doRefresh = useRefresh();

  const login = async (
    payload: ApiLoginPayload,
    options?: { redirectTo?: string; accountType?: string }
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doLogin.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          const token = responseData.data.access_token;
          const refreshToken = responseData.data.refresh_token;

          setAuthToken(token);
          setRefreshToken(refreshToken);

          success = true;
          toast.success(`${responseData.message}`);
          router.push(options?.redirectTo ?? '/');
        } else {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.log('[login] non-success response:', responseData);
          }

          const nextStep = (responseData as any)?.details?.next_step;
          const userId = (responseData as any)?.details?.user_id;
          const otpVerified = (responseData as any)?.details?.otp_verified;

          if (
            (nextStep === 'verify_otp' || otpVerified === false) &&
            userId &&
            typeof window !== 'undefined'
          ) {
            sessionStorage.setItem(REGISTER_USER_ID_KEY, userId);
            if (options?.accountType) {
              sessionStorage.setItem(REGISTER_ACCOUNT_KEY, options.accountType);
            }

            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.log('[login] otp redirect detected', {
                nextStep,
                otpVerified,
                userId,
                savedUserId: sessionStorage.getItem(REGISTER_USER_ID_KEY),
                savedAccountType: sessionStorage.getItem(REGISTER_ACCOUNT_KEY),
              });
            }

            toast.error(extractResponseErrors(responseData));
            router.push(
              `/otp?purpose=registration${
                options?.accountType ? `&account=${options.accountType}` : ''
              }`
            );
            return false;
          }

          toast.error(extractResponseErrors(responseData));
        }
      },
      async (error) => {
        const responseData = error?.response?.data;
        if (responseData) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.log('[login] axios error response:', responseData);
          }

          const nextStep = responseData?.details?.next_step;
          const userId = responseData?.details?.user_id;
          const otpVerified = responseData?.details?.otp_verified;

          if (
            (nextStep === 'verify_otp' || otpVerified === false) &&
            userId &&
            typeof window !== 'undefined'
          ) {
            sessionStorage.setItem(REGISTER_USER_ID_KEY, userId);
            if (options?.accountType) {
              sessionStorage.setItem(REGISTER_ACCOUNT_KEY, options.accountType);
            }

            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.log('[login] otp redirect detected (axios error)', {
                nextStep,
                otpVerified,
                userId,
                savedUserId: sessionStorage.getItem(REGISTER_USER_ID_KEY),
                savedAccountType: sessionStorage.getItem(REGISTER_ACCOUNT_KEY),
              });
            }

            toast.error(extractResponseErrors(responseData));
            router.push(
              `/otp?purpose=registration${
                options?.accountType ? `&account=${options.accountType}` : ''
              }`
            );
            return false;
          }

          toast.error(extractResponseErrors(responseData));
          return false;
        }

        toast.error(extractApiErrorMessage(error));
        return false;
      }
    );

    return success;
  };

  const logout = async (payload: ApiRefreshTokenPayload): Promise<void> => {
    await tryExecute(
      () => doLogout.mutateAsync(payload),
      async () => {
        Cookies.remove('medi_refresh');

        toast.success('Logged out successfully');
        router.push('/login');
      },
      async (error) => {
        toast.error(
          extractApiErrorMessage(error, 'An error occurred during logout')
        );
      }
    );
  };

  const refresh = async (payload: ApiRefreshTokenPayload): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doRefresh.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          const token = responseData.data.access_token;

          setAuthToken(token);

          success = true;
          toast.success(`${responseData.message}`);
        } else if (response.status === 401) {
          toast.error(extractResponseErrors(responseData));
        } else {
          toast.error(extractApiErrorMessage(responseData));
        }
      },
      async (error) => {
        toast.error(
          extractApiErrorMessage(
            error,
            'An error occurred during token refresh'
          )
        );
      }
    );

    return success;
  };

  return {
    login,
    refresh,
    logout,
  };
};
