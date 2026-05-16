import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import type {
  ApiBatchRiderActivityPayload,
  ApiCancelRidePayload,
  ApiCreateGuestBookingPayload,
  ApiCreateGuestSessionPayload,
  ApiCreateRecurringRidePayload,
  ApiCreateRidePayload,
  ApiCreateSafetyReportPayload,
  ApiInternalResponse,
  ApiResponse,
  ApiRebookRidePayload,
  ApiRideResponse,
  ApiRideRatingResponse,
  ApiSafetyReportResponse,
  ApiShareRideResponse,
  ApiStatusTransitionPayload,
  ApiSubmitRatingPayload,
  ApiSubmitVehicleChecklistPayload,
  ApiUpdateFarePayload,
  ApiVehicleChecklistResponse,
  ApiGuestBookingResponse,
  ApiGuestSessionResponse,
  ApiRecurringRideResponse,
} from '../../../../types';

export const createRide = async (payload: ApiCreateRidePayload) => {
  return await getApiClient().post<
    ApiRideResponse,
    AxiosResponse<ApiRideResponse>
  >(resolveRoute(ROUTES.createRide), payload);
};

export const cancelRide = async (payload: {
  rideId: string;
  body: ApiCancelRidePayload;
}) => {
  return await getApiClient().put<
    ApiRideResponse,
    AxiosResponse<ApiRideResponse>
  >(resolveRoute(ROUTES.cancelRide, payload.rideId), payload.body);
};

export const submitRideRating = async (payload: {
  rideId: string;
  body: ApiSubmitRatingPayload;
}) => {
  return await getApiClient().post<
    ApiRideRatingResponse,
    AxiosResponse<ApiRideRatingResponse>
  >(resolveRoute(ROUTES.submitRideRating, payload.rideId), payload.body);
};

export const rebookRide = async (payload: {
  rideId: string;
  body: ApiRebookRidePayload;
}) => {
  return await getApiClient().post<
    ApiRideResponse,
    AxiosResponse<ApiRideResponse>
  >(resolveRoute(ROUTES.rebookRide, payload.rideId), payload.body);
};

export const shareRide = async (payload: { rideId: string }) => {
  return await getApiClient().post<
    ApiShareRideResponse,
    AxiosResponse<ApiShareRideResponse>
  >(resolveRoute(ROUTES.shareRide, payload.rideId));
};

export const transitionRideStatus = async (payload: {
  rideId: string;
  body: ApiStatusTransitionPayload;
}) => {
  return await getApiClient().put<
    ApiRideResponse,
    AxiosResponse<ApiRideResponse>
  >(resolveRoute(ROUTES.transitionRideStatus, payload.rideId), payload.body);
};

export const createGuestSession = async (
  payload: ApiCreateGuestSessionPayload
) => {
  return await getApiClient().post<
    ApiGuestSessionResponse,
    AxiosResponse<ApiGuestSessionResponse>
  >(resolveRoute(ROUTES.createGuestSession), payload);
};

export const createGuestBooking = async (
  payload: ApiCreateGuestBookingPayload
) => {
  return await getApiClient().post<
    ApiGuestBookingResponse,
    AxiosResponse<ApiGuestBookingResponse>
  >(resolveRoute(ROUTES.createGuestBooking), payload);
};

export const createRecurringRide = async (
  payload: ApiCreateRecurringRidePayload
) => {
  return await getApiClient().post<
    ApiRecurringRideResponse,
    AxiosResponse<ApiRecurringRideResponse>
  >(resolveRoute(ROUTES.createRecurringRide), payload);
};

export const deactivateRecurringRide = async (payload: {
  recurringRideId: string;
}) => {
  return await getApiClient().delete<
    ApiResponse<null>,
    AxiosResponse<ApiResponse<null>>
  >(resolveRoute(ROUTES.deactivateRecurringRide, payload.recurringRideId));
};

export const createSafetyReport = async (
  payload: ApiCreateSafetyReportPayload
) => {
  return await getApiClient().post<
    ApiSafetyReportResponse,
    AxiosResponse<ApiSafetyReportResponse>
  >(resolveRoute(ROUTES.createSafetyReport), payload);
};

export const submitVehicleChecklist = async (
  payload: ApiSubmitVehicleChecklistPayload
) => {
  return await getApiClient().post<
    ApiVehicleChecklistResponse,
    AxiosResponse<ApiVehicleChecklistResponse>
  >(resolveRoute(ROUTES.submitVehicleChecklist), payload);
};
