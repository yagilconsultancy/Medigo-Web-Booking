import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import type {
  ApiBookingChannelsResponse,
  ApiDashboardOverviewResponse,
  ApiHealthLiveResponse,
  ApiHealthReadyResponse,
  ApiMyActiveRideResponse,
  ApiMyRidesResponse,
  ApiPublicBookingConfigResponse,
  ApiRecentActivityResponse,
  ApiRideDetailResponse,
  ApiRideFareResponse,
  ApiRideRatingsResponse,
  ApiRideTimelineResponse,
  ApiSafetyReportsResponse,
  ApiServiceQualityResponse,
  ApiTopFacilitiesResponse,
  ApiTopFleetPartnersResponse,
  ApiTransportDistributionResponse,
  ApiTripStatusDistributionResponse,
  ApiTripVolumeTrendResponse,
  ApiVehicleChecklistsResponse,
  ApiGuestBookingResponse,
  ApiGuestSessionResponse,
  ApiSharedRideResponse,
  ApiRecurringRidesResponse,
  ApiInternalResponse,
} from '../../../../types';

export const healthLive = async () => {
  return await getApiClient().get<
    ApiHealthLiveResponse,
    AxiosResponse<ApiHealthLiveResponse>
  >(resolveRoute(ROUTES.healthLive));
};

export const healthReady = async () => {
  return await getApiClient().get<
    ApiHealthReadyResponse,
    AxiosResponse<ApiHealthReadyResponse>
  >(resolveRoute(ROUTES.healthReady));
};

export const internalGetActiveRides = async () => {
  return await getApiClient().get<
    ApiInternalResponse,
    AxiosResponse<ApiInternalResponse>
  >(resolveRoute(ROUTES.internalGetActiveRides));
};

export const internalGetCompletedTodayCount = async () => {
  return await getApiClient().get<
    ApiInternalResponse,
    AxiosResponse<ApiInternalResponse>
  >(resolveRoute(ROUTES.internalGetCompletedTodayCount));
};

export const internalGetRide = async (rideId: string) => {
  return await getApiClient().get<
    ApiInternalResponse,
    AxiosResponse<ApiInternalResponse>
  >(resolveRoute(ROUTES.internalGetRide, rideId));
};

export const internalGetRiderRides = async (riderId: string) => {
  return await getApiClient().get<
    ApiInternalResponse,
    AxiosResponse<ApiInternalResponse>
  >(resolveRoute(ROUTES.internalGetRiderRides, riderId));
};

export const internalGetRiderStats = async (riderId: string) => {
  return await getApiClient().get<
    ApiInternalResponse,
    AxiosResponse<ApiInternalResponse>
  >(resolveRoute(ROUTES.internalGetRiderStats, riderId));
};

export const getRideDetail = async (rideId: string) => {
  return await getApiClient().get<
    ApiRideDetailResponse,
    AxiosResponse<ApiRideDetailResponse>
  >(resolveRoute(ROUTES.getRideDetail, rideId));
};

export const getRideFare = async (rideId: string) => {
  return await getApiClient().get<
    ApiRideFareResponse,
    AxiosResponse<ApiRideFareResponse>
  >(resolveRoute(ROUTES.getRideFare, rideId));
};

export const getRideRatings = async (rideId: string) => {
  return await getApiClient().get<
    ApiRideRatingsResponse,
    AxiosResponse<ApiRideRatingsResponse>
  >(resolveRoute(ROUTES.getRideRatings, rideId));
};

export const getRideTimeline = async (rideId: string) => {
  return await getApiClient().get<
    ApiRideTimelineResponse,
    AxiosResponse<ApiRideTimelineResponse>
  >(resolveRoute(ROUTES.getRideTimeline, rideId));
};

export const ridesAnalyticsOverview = async () => {
  return await getApiClient().get<
    ApiDashboardOverviewResponse,
    AxiosResponse<ApiDashboardOverviewResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsOverview));
};

export const ridesAnalyticsTripVolume = async () => {
  return await getApiClient().get<
    ApiTripVolumeTrendResponse,
    AxiosResponse<ApiTripVolumeTrendResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsTripVolume));
};

export const ridesAnalyticsTripStatus = async () => {
  return await getApiClient().get<
    ApiTripStatusDistributionResponse,
    AxiosResponse<ApiTripStatusDistributionResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsTripStatus));
};

export const ridesAnalyticsTransportDistribution = async () => {
  return await getApiClient().get<
    ApiTransportDistributionResponse,
    AxiosResponse<ApiTransportDistributionResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsTransportDistribution));
};

export const ridesAnalyticsBookingChannels = async () => {
  return await getApiClient().get<
    ApiBookingChannelsResponse,
    AxiosResponse<ApiBookingChannelsResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsBookingChannels));
};

export const ridesAnalyticsServiceQuality = async () => {
  return await getApiClient().get<
    ApiServiceQualityResponse,
    AxiosResponse<ApiServiceQualityResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsServiceQuality));
};

export const ridesAnalyticsTopFacilities = async () => {
  return await getApiClient().get<
    ApiTopFacilitiesResponse,
    AxiosResponse<ApiTopFacilitiesResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsTopFacilities));
};

export const ridesAnalyticsTopFleetPartners = async () => {
  return await getApiClient().get<
    ApiTopFleetPartnersResponse,
    AxiosResponse<ApiTopFleetPartnersResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsTopFleetPartners));
};

export const ridesAnalyticsRecentActivity = async () => {
  return await getApiClient().get<
    ApiRecentActivityResponse,
    AxiosResponse<ApiRecentActivityResponse>
  >(resolveRoute(ROUTES.ridesAnalyticsRecentActivity));
};

export const publicBookingFlowConfig = async () => {
  return await getApiClient().get<
    ApiPublicBookingConfigResponse,
    AxiosResponse<ApiPublicBookingConfigResponse>
  >(resolveRoute(ROUTES.publicBookingFlowConfig));
};

export const getGuestSession = async (sessionId: string) => {
  return await getApiClient().get<
    ApiGuestSessionResponse,
    AxiosResponse<ApiGuestSessionResponse>
  >(resolveRoute(ROUTES.getGuestSession, sessionId));
};

export const getGuestBooking = async (rideId: string) => {
  return await getApiClient().get<
    ApiGuestBookingResponse,
    AxiosResponse<ApiGuestBookingResponse>
  >(resolveRoute(ROUTES.getGuestBooking, rideId));
};

export const listRecurringRides = async () => {
  return await getApiClient().get<
    ApiRecurringRidesResponse,
    AxiosResponse<ApiRecurringRidesResponse>
  >(resolveRoute(ROUTES.listRecurringRides));
};

export const getMyRides = async (params?: {
  status?: string | null;
  page?: number;
  limit?: number;
}) => {
  return await getApiClient().get<
    ApiMyRidesResponse,
    AxiosResponse<ApiMyRidesResponse>
  >(resolveRoute(ROUTES.getMyRides), { params });
};

export const getMyActiveRide = async () => {
  return await getApiClient().get<
    ApiMyActiveRideResponse,
    AxiosResponse<ApiMyActiveRideResponse>
  >(resolveRoute(ROUTES.getMyActiveRide));
};

export const listSafetyReports = async (params?: {
  page?: number;
  limit?: number;
}) => {
  return await getApiClient().get<
    ApiSafetyReportsResponse,
    AxiosResponse<ApiSafetyReportsResponse>
  >(resolveRoute(ROUTES.listSafetyReports), { params });
};

export const getVehicleChecklists = async () => {
  return await getApiClient().get<
    ApiVehicleChecklistsResponse,
    AxiosResponse<ApiVehicleChecklistsResponse>
  >(resolveRoute(ROUTES.getVehicleChecklists));
};

export const getSharedRide = async (shareToken: string) => {
  return await getApiClient().get<
    ApiSharedRideResponse,
    AxiosResponse<ApiSharedRideResponse>
  >(resolveRoute(ROUTES.getSharedRide, shareToken));
};
