import type { AxiosResponse } from 'axios';
import { getApiClient, resolveRoute, ROUTES } from '@/common';
import type { ApiDriverTrackingResponse } from '../../../../types';

export const getCurrentDriverTracking = async () => {
  return await getApiClient().get<
    ApiDriverTrackingResponse,
    AxiosResponse<ApiDriverTrackingResponse>
  >(resolveRoute(ROUTES.getCurrentDriverTracking));
};
