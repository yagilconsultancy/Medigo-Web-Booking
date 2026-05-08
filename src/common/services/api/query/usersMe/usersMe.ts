import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import type {
  ApiGetMyConsentResponse,
  ApiGetMyDocumentResponse,
  ApiGetMyProfileResponse,
  ApiGetOnboardingStatusResponse,
  ApiGetSavedLocationResponse,
  ApiGetSettingsResponse,
  ApiListEmergencyContactsResponse,
  ApiListMyDocumentsResponse,
  ApiListPassengersResponse,
  ApiListSavedLocationsResponse,
} from '../../../../types';

export const getMyProfile = async () => {
  return await getApiClient().get<
    ApiGetMyProfileResponse,
    AxiosResponse<ApiGetMyProfileResponse>
  >(resolveRoute(ROUTES.getMyProfile));
};

export const listEmergencyContacts = async () => {
  return await getApiClient().get<
    ApiListEmergencyContactsResponse,
    AxiosResponse<ApiListEmergencyContactsResponse>
  >(resolveRoute(ROUTES.listEmergencyContacts));
};

export const getMyConsent = async () => {
  return await getApiClient().get<
    ApiGetMyConsentResponse,
    AxiosResponse<ApiGetMyConsentResponse>
  >(resolveRoute(ROUTES.getMyConsent));
};

export const getOnboardingStatus = async () => {
  return await getApiClient().get<
    ApiGetOnboardingStatusResponse,
    AxiosResponse<ApiGetOnboardingStatusResponse>
  >(resolveRoute(ROUTES.getOnboardingStatus));
};

export const listMyDocuments = async () => {
  return await getApiClient().get<
    ApiListMyDocumentsResponse,
    AxiosResponse<ApiListMyDocumentsResponse>
  >(resolveRoute(ROUTES.listMyDocuments));
};

export const getMyDocument = async (documentId: string) => {
  return await getApiClient().get<
    ApiGetMyDocumentResponse,
    AxiosResponse<ApiGetMyDocumentResponse>
  >(resolveRoute(ROUTES.getMyDocument, documentId));
};

export const listPassengers = async () => {
  return await getApiClient().get<
    ApiListPassengersResponse,
    AxiosResponse<ApiListPassengersResponse>
  >(resolveRoute(ROUTES.listPassengers));
};

export const getSettings = async () => {
  return await getApiClient().get<
    ApiGetSettingsResponse,
    AxiosResponse<ApiGetSettingsResponse>
  >(resolveRoute(ROUTES.getSettings));
};

export const listSavedLocations = async () => {
  return await getApiClient().get<
    ApiListSavedLocationsResponse,
    AxiosResponse<ApiListSavedLocationsResponse>
  >(resolveRoute(ROUTES.listSavedLocations));
};

export const getSavedLocation = async (locationId: string) => {
  return await getApiClient().get<
    ApiGetSavedLocationResponse,
    AxiosResponse<ApiGetSavedLocationResponse>
  >(resolveRoute(ROUTES.getSavedLocation, locationId));
};
