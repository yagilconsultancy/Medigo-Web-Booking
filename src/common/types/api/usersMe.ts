import { ApiResponse } from './common';

// ====================== USERS (ME) ======================

export type ApiUpdateMyProfilePayload = {
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null; // YYYY-MM-DD
  gender?: string | null;
  avatar_url?: File | null;
  home_address?: string | null;
  medical_notes?: string | null;
  phone?: string | null;
};

export type ApiUserMeProfile = {
  id: string;
  email: string | null;
  phone: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: string | null; // YYYY-MM-DD
  gender: string | null;
  avatar_url: string | null;
  home_address: string | null;
  medical_notes: string | null;
  role: string;
  business_id: string | null;
  is_active: boolean;
  is_guest: boolean;
  consent_emergency_services: boolean;
  consent_privacy_policy: boolean;
  consent_terms_of_service: boolean;
  consent_data_location: boolean;
  consent_accepted_at: string | null; // ISO
  onboarding_step: number;
  onboarding_completed: boolean;
};

export type ApiGetMyProfileResponse = ApiResponse<ApiUserMeProfile>;
export type ApiUpdateMyProfileResponse = ApiResponse<ApiUserMeProfile>;
export type ApiDeleteMyProfileResponse = ApiResponse<null>;

// ====================== EMERGENCY CONTACTS ======================

export type ApiEmergencyContactCreatePayload = {
  name: string;
  phone: string;
  relationship_type?: string | null;
  is_primary?: boolean;
};

export type ApiEmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relationship_type: string | null;
  is_primary: boolean;
};

export type ApiListEmergencyContactsResponse = ApiResponse<
  ApiEmergencyContact[]
>;
export type ApiCreateEmergencyContactResponse =
  ApiResponse<ApiEmergencyContact>;
export type ApiDeleteEmergencyContactResponse = ApiResponse<null>;

// ====================== CONSENT ======================

export type ApiConsent = {
  consent_emergency_services: boolean;
  consent_privacy_policy: boolean;
  consent_terms_of_service: boolean;
  consent_data_location: boolean;
  consent_accepted_at: string | null; // ISO
};

export type ApiUpdateConsentPayload = {
  consent_emergency_services: boolean;
  consent_privacy_policy: boolean;
  consent_terms_of_service: boolean;
  consent_data_location: boolean;
};

export type ApiGetMyConsentResponse = ApiResponse<ApiConsent>;
export type ApiUpdateMyConsentResponse = ApiResponse<ApiConsent>;

// ====================== ONBOARDING ======================

export type ApiOnboardingStatus = {
  current_step: number;
  total_steps: number;
  completed: boolean;
  steps: Record<string, any>[];
};

export type ApiGetOnboardingStatusResponse = ApiResponse<ApiOnboardingStatus>;
export type ApiAdvanceOnboardingResponse = ApiResponse<ApiOnboardingStatus>;

// ====================== DOCUMENTS ======================

export type ApiDocumentUpload = {
  id: string;
  document_type: string;
  file_name: string;
  verification_status: string;
  created_at: string; // ISO
};

export type ApiDocument = {
  id: string;
  document_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  verification_status: string;
  rejection_reason: string | null;
  presigned_url: string | null;
  created_at: string; // ISO
  updated_at: string; // ISO
};

export type ApiUploadMyDocumentPayload = {
  document_type: string;
  file: File;
};

export type ApiUploadAvatarPayload = {
  file: File;
};

export type ApiListMyDocumentsResponse = ApiResponse<ApiDocumentUpload[]>;
export type ApiUploadMyDocumentResponse = ApiResponse<ApiDocumentUpload>;
export type ApiGetMyDocumentResponse = ApiResponse<ApiDocument>;
export type ApiUploadAvatarResponse = ApiResponse<ApiUserMeProfile>;

// ====================== PASSENGERS ======================

export type ApiPassengerCreatePayload = {
  first_name: string;
  last_name: string;
  date_of_birth?: string | null; // YYYY-MM-DD
  mobility_level?: string | null;
  assistance_level?: string | null;
  medical_notes?: string | null;
  is_self?: boolean;
};

export type ApiPassengerUpdatePayload = {
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null; // YYYY-MM-DD
  mobility_level?: string | null;
  assistance_level?: string | null;
  medical_notes?: string | null;
  is_self?: boolean;
};

export type ApiPassenger = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null; // YYYY-MM-DD
  mobility_level: string | null;
  assistance_level: string | null;
  medical_notes: string | null;
  is_self: boolean;
};

export type ApiListPassengersResponse = ApiResponse<ApiPassenger[]>;
export type ApiCreatePassengerResponse = ApiResponse<ApiPassenger>;
export type ApiUpdatePassengerResponse = ApiResponse<ApiPassenger>;
export type ApiDeletePassengerResponse = ApiResponse<null>;

// ====================== SETTINGS ======================

export type ApiUserSettings = {
  push_ride_updates: boolean;
  push_chat_messages: boolean;
  push_earnings: boolean;
  push_promotions: boolean;
  email_ride_receipts: boolean;
  email_weekly_summary: boolean;
  sms_ride_updates: boolean;
  share_location_with_rider: boolean;
  show_profile_photo: boolean;
  show_rating: boolean;
  allow_data_analytics: boolean;
  language: string;
  distance_unit: string;
  theme: string;
  auto_accept_rides: boolean;
  navigation_app: string;
  sound_enabled: boolean;
};

export type ApiUpdateNotificationSettingsPayload = {
  push_ride_updates?: boolean | null;
  push_chat_messages?: boolean | null;
  push_earnings?: boolean | null;
  push_promotions?: boolean | null;
  email_ride_receipts?: boolean | null;
  email_weekly_summary?: boolean | null;
  sms_ride_updates?: boolean | null;
};

export type ApiUpdatePrivacySettingsPayload = {
  share_location_with_rider?: boolean | null;
  show_profile_photo?: boolean | null;
  show_rating?: boolean | null;
  allow_data_analytics?: boolean | null;
};

export type ApiUpdateAppSettingsPayload = {
  language?: string | null;
  distance_unit?: string | null;
  theme?: string | null;
  auto_accept_rides?: boolean | null;
  navigation_app?: string | null;
  sound_enabled?: boolean | null;
};

export type ApiGetSettingsResponse = ApiResponse<ApiUserSettings>;
export type ApiUpdateNotificationSettingsResponse =
  ApiResponse<ApiUserSettings>;
export type ApiUpdatePrivacySettingsResponse = ApiResponse<ApiUserSettings>;
export type ApiUpdateAppSettingsResponse = ApiResponse<ApiUserSettings>;

// ====================== SAVED LOCATIONS ======================

export type ApiLocationType = 'home' | 'work' | 'medical' | 'custom';

export type ApiCreateSavedLocationPayload = {
  label: string;
  location_type: ApiLocationType;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  place_id?: string | null;
  notes?: string | null;
  is_default?: boolean;
};

export type ApiUpdateSavedLocationPayload = {
  label?: string | null;
  location_type?: ApiLocationType | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  place_id?: string | null;
  notes?: string | null;
  is_default?: boolean | null;
};

export type ApiSavedLocation = {
  id: string;
  label: string;
  location_type: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
  notes: string | null;
  is_default: boolean;
  sort_order: number;
  created_at: string; // ISO
  updated_at: string; // ISO
};

export type ApiReorderSavedLocationsPayload = {
  location_ids: string[];
};

export type ApiListSavedLocationsResponse = ApiResponse<ApiSavedLocation[]>;
export type ApiCreateSavedLocationResponse = ApiResponse<ApiSavedLocation>;
export type ApiGetSavedLocationResponse = ApiResponse<ApiSavedLocation>;
export type ApiUpdateSavedLocationResponse = ApiResponse<ApiSavedLocation>;
export type ApiDeleteSavedLocationResponse = ApiResponse<null>;
export type ApiReorderSavedLocationsResponse = ApiResponse<ApiSavedLocation[]>;
