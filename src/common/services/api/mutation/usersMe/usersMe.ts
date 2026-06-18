import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import type {
  ApiAdvanceOnboardingResponse,
  ApiCreateEmergencyContactResponse,
  ApiCreatePassengerResponse,
  ApiCreateSavedLocationResponse,
  ApiDeleteEmergencyContactResponse,
  ApiDeleteMyProfileResponse,
  ApiDeletePassengerResponse,
  ApiDeleteSavedLocationResponse,
  ApiCreateSavedLocationPayload,
  ApiEmergencyContactCreatePayload,
  ApiPassengerCreatePayload,
  ApiPassengerUpdatePayload,
  ApiReorderSavedLocationsPayload,
  ApiReorderSavedLocationsResponse,
  ApiUpdateAppSettingsPayload,
  ApiUpdateAppSettingsResponse,
  ApiUpdateMyConsentResponse,
  ApiUpdateMyProfilePayload,
  ApiUpdateMyProfileResponse,
  ApiUpdateNotificationSettingsPayload,
  ApiUpdateNotificationSettingsResponse,
  ApiUpdatePassengerResponse,
  ApiUpdatePrivacySettingsPayload,
  ApiUpdatePrivacySettingsResponse,
  ApiUpdateSavedLocationPayload,
  ApiUpdateSavedLocationResponse,
  ApiUpdateConsentPayload,
  ApiUploadAvatarPayload,
  ApiUploadAvatarResponse,
  ApiUploadMyDocumentPayload,
  ApiUploadMyDocumentResponse,
} from '../../../../types';

export const updateMyProfile = async (payload: ApiUpdateMyProfilePayload) => {
  const formData = new FormData();
  if (payload.first_name !== undefined) {
    formData.append('first_name', payload.first_name);
  }
  if (payload.last_name !== undefined) {
    formData.append('last_name', payload.last_name);
  }
  if (payload.date_of_birth !== undefined) {
    formData.append('date_of_birth', payload.date_of_birth);
  }
  if (payload.gender !== undefined) {
    formData.append('gender', payload.gender);
  }
  if (payload.avatar_url !== undefined && payload.avatar_url instanceof File) {
    formData.append('avatar', payload.avatar_url);
  }
  if (payload.home_address !== undefined) {
    formData.append('home_address', payload.home_address);
  }
  if (payload.medical_notes !== undefined) {
    formData.append('medical_notes', payload.medical_notes);
  }
  if (payload.phone !== undefined) {
    formData.append('phone', payload.phone);
  }
  return await getApiClient().put<
    ApiUpdateMyProfileResponse,
    AxiosResponse<ApiUpdateMyProfileResponse>
  >(resolveRoute(ROUTES.updateMyProfile), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteMyProfile = async () => {
  return await getApiClient().delete<
    ApiDeleteMyProfileResponse,
    AxiosResponse<ApiDeleteMyProfileResponse>
  >(resolveRoute(ROUTES.deleteMyProfile));
};

export const createEmergencyContact = async (
  payload: ApiEmergencyContactCreatePayload
) => {
  return await getApiClient().post<
    ApiCreateEmergencyContactResponse,
    AxiosResponse<ApiCreateEmergencyContactResponse>
  >(resolveRoute(ROUTES.createEmergencyContact), payload);
};

export const deleteEmergencyContact = async (payload: {
  contactId: string;
}) => {
  return await getApiClient().delete<
    ApiDeleteEmergencyContactResponse,
    AxiosResponse<ApiDeleteEmergencyContactResponse>
  >(resolveRoute(ROUTES.deleteEmergencyContact, payload.contactId));
};

export const updateMyConsent = async (payload: ApiUpdateConsentPayload) => {
  return await getApiClient().put<
    ApiUpdateMyConsentResponse,
    AxiosResponse<ApiUpdateMyConsentResponse>
  >(resolveRoute(ROUTES.updateMyConsent), payload);
};

export const advanceOnboarding = async (payload: { step: string }) => {
  return await getApiClient().put<
    ApiAdvanceOnboardingResponse,
    AxiosResponse<ApiAdvanceOnboardingResponse>
  >(resolveRoute(ROUTES.advanceOnboarding, payload.step), undefined);
};

export const uploadMyDocument = async (payload: ApiUploadMyDocumentPayload) => {
  const formData = new FormData();
  formData.append('document_type', payload.document_type);
  formData.append('file', payload.file);

  return await getApiClient().post<
    ApiUploadMyDocumentResponse,
    AxiosResponse<ApiUploadMyDocumentResponse>
  >(resolveRoute(ROUTES.uploadMyDocument), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadAvatar = async (payload: ApiUploadAvatarPayload) => {
  const formData = new FormData();
  formData.append('file', payload.file);

  return await getApiClient().put<
    ApiUploadAvatarResponse,
    AxiosResponse<ApiUploadAvatarResponse>
  >(resolveRoute(ROUTES.uploadAvatar), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createPassenger = async (payload: ApiPassengerCreatePayload) => {
  return await getApiClient().post<
    ApiCreatePassengerResponse,
    AxiosResponse<ApiCreatePassengerResponse>
  >(resolveRoute(ROUTES.createPassenger), payload);
};

export const updatePassenger = async (
  payload: { passengerId: string } & ApiPassengerUpdatePayload
) => {
  const { passengerId, ...body } = payload;
  return await getApiClient().put<
    ApiUpdatePassengerResponse,
    AxiosResponse<ApiUpdatePassengerResponse>
  >(resolveRoute(ROUTES.updatePassenger, passengerId), body);
};

export const deletePassenger = async (payload: { passengerId: string }) => {
  return await getApiClient().delete<
    ApiDeletePassengerResponse,
    AxiosResponse<ApiDeletePassengerResponse>
  >(resolveRoute(ROUTES.deletePassenger, payload.passengerId));
};

export const updateNotificationSettings = async (
  payload: ApiUpdateNotificationSettingsPayload
) => {
  return await getApiClient().put<
    ApiUpdateNotificationSettingsResponse,
    AxiosResponse<ApiUpdateNotificationSettingsResponse>
  >(resolveRoute(ROUTES.updateNotificationSettings), payload);
};

export const updatePrivacySettings = async (
  payload: ApiUpdatePrivacySettingsPayload
) => {
  return await getApiClient().put<
    ApiUpdatePrivacySettingsResponse,
    AxiosResponse<ApiUpdatePrivacySettingsResponse>
  >(resolveRoute(ROUTES.updatePrivacySettings), payload);
};

export const updateAppSettings = async (
  payload: ApiUpdateAppSettingsPayload
) => {
  return await getApiClient().put<
    ApiUpdateAppSettingsResponse,
    AxiosResponse<ApiUpdateAppSettingsResponse>
  >(resolveRoute(ROUTES.updateAppSettings), payload);
};

export const createSavedLocation = async (
  payload: ApiCreateSavedLocationPayload
) => {
  return await getApiClient().post<
    ApiCreateSavedLocationResponse,
    AxiosResponse<ApiCreateSavedLocationResponse>
  >(resolveRoute(ROUTES.createSavedLocation), payload);
};

export const updateSavedLocation = async (
  payload: { locationId: string } & ApiUpdateSavedLocationPayload
) => {
  const { locationId, ...body } = payload;
  return await getApiClient().put<
    ApiUpdateSavedLocationResponse,
    AxiosResponse<ApiUpdateSavedLocationResponse>
  >(resolveRoute(ROUTES.updateSavedLocation, locationId), body);
};

export const deleteSavedLocation = async (payload: { locationId: string }) => {
  return await getApiClient().delete<
    ApiDeleteSavedLocationResponse,
    AxiosResponse<ApiDeleteSavedLocationResponse>
  >(resolveRoute(ROUTES.deleteSavedLocation, payload.locationId));
};

export const reorderSavedLocations = async (
  payload: ApiReorderSavedLocationsPayload
) => {
  return await getApiClient().put<
    ApiReorderSavedLocationsResponse,
    AxiosResponse<ApiReorderSavedLocationsResponse>
  >(resolveRoute(ROUTES.reorderSavedLocations), payload);
};
