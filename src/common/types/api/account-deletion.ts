import { ApiResponse } from './common';

/**
 * Public account deletion request — the form published at
 * web.getmedigo.com/medigo-delete-account as the Google Play deletion URL.
 */
export type DeleteAccountFormValues = {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  reason: string;
  confirmUnderstanding: boolean;
};

export type ApiRequestAccountDeletionPayload = {
  full_name: string;
  email: string;
  phone?: string | null;
  reason?: string | null;
  confirm_understanding: boolean;
};

export type ApiVerifyAccountDeletionPayload = {
  email: string;
  code: string;
};

export type ApiResendAccountDeletionOtpPayload = {
  email: string;
};

export type AccountDeletionAcknowledgement = {
  message: string;
};

export type AccountDeletionVerifiedData = {
  reference: string;
  status: string;
  submitted_at: string;
  message: string;
};

export type ApiRequestAccountDeletionResponse =
  ApiResponse<AccountDeletionAcknowledgement>;

export type ApiVerifyAccountDeletionResponse =
  ApiResponse<AccountDeletionVerifiedData>;
