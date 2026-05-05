import { ApiResponse } from './common';

// ====================== USER PROFILE ======================

export interface UserProfile {
  id: string;
  email: string;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  avatar_url?: string | null;
  home_address?: string | null;
  medical_notes?: string | null;
  role: string;
  business_id?: string | null;
  is_active: boolean;
  consent_emergency_services?: boolean;
  consent_privacy_policy?: boolean;
  consent_terms_of_service?: boolean;
  consent_data_location?: boolean;
  consent_accepted_at?: string | null;
  onboarding_step?: number;
  onboarding_completed?: boolean;
}

export type ApiUserProfileResponse = ApiResponse<UserProfile>;
