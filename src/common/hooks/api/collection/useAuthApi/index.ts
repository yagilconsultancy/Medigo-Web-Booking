import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLogin, useLogout, useRefresh } from '../../mutation';
import { ApiLoginPayload, ApiLoginRefreshRequest } from '../../../../types';
import {
  extractResponseErrors,
  setAuthToken,
  setRefreshToken,
  tryExecute,
} from '../../../../utils';
import Cookies from 'js-cookie';

export const useAuthApi = () => {
  const doLogin = useLogin();
  const router = useRouter();
  const doLogout = useLogout();
  const doRefresh = useRefresh();

  const login = async (payload: ApiLoginPayload): Promise<boolean> => {
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
          router.push('/');
        } else if (response.status === 401) {
          toast.error(extractResponseErrors(responseData));
        } else {
          toast.error('An error occurred');
        }
      },
      async () => {
        toast.error('An error occurred');
      }
    );

    return success;
  };

  const logout = async (payload: ApiLoginRefreshRequest): Promise<void> => {
    await tryExecute(
      () => doLogout.mutateAsync(payload),
      async () => {
        Cookies.remove('medi_refresh');

        toast.success('Logged out successfully');
        router.push('/login');
      },
      async () => {
        toast.error('An error occurred during logout');
      }
    );
  };

  const refresh = async (payload: ApiLoginRefreshRequest): Promise<boolean> => {
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
          toast.error('An error occurred');
        }
      },
      async () => {
        toast.error('An error occurred during token refresh');
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
