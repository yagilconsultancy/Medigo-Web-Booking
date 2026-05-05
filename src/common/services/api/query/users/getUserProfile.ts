import { AxiosResponse } from 'axios';
import { getApiClient } from '../../../../lib/api-client';
import { resolveRoute, ROUTES } from '../../../../constants';
import { ApiUserProfileResponse } from '../../../../types';

export const getUserProfile = async () => {
  return await getApiClient().get<
    ApiUserProfileResponse,
    AxiosResponse<ApiUserProfileResponse>
  >(resolveRoute(ROUTES.getUserProfile));
};
