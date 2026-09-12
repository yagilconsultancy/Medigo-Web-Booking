import { toast } from 'sonner';
import {
  useRequestAccountDeletion,
  useResendAccountDeletionOtp,
  useVerifyAccountDeletion,
} from '../../mutation';
import {
  AccountDeletionVerifiedData,
  DeleteAccountFormValues,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

const trimmedOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * The API's error shape is `{ success, message, error_code }`, but the shared
 * extractResponseErrors() only reads `.error` and so collapses everything to
 * "An error occurred". On this flow the exact wording is the feedback — "that
 * code is not valid or has expired" versus "too many incorrect attempts" is
 * the difference between retrying and requesting a fresh code — so prefer the
 * server's message and fall back to the shared helper.
 */
const errorMessage = (responseData: any) =>
  (typeof responseData?.message === 'string' && responseData.message) ||
  extractResponseErrors(responseData);

export const useAccountDeletionApi = () => {
  const doRequestAccountDeletion = useRequestAccountDeletion();
  const doVerifyAccountDeletion = useVerifyAccountDeletion();
  const doResendAccountDeletionOtp = useResendAccountDeletionOtp();

  /**
   * Step 1 — file the request. The API answers identically whether or not the
   * email belongs to an account (so the form cannot be used to discover who
   * has a MediGo account), which is why this only reports success or failure
   * and never "no such account".
   */
  const submitRequest = async (
    values: DeleteAccountFormValues
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () =>
        doRequestAccountDeletion.mutateAsync({
          full_name: values.fullName.trim(),
          email: values.emailAddress.trim(),
          phone: trimmedOrNull(values.phoneNumber),
          reason: trimmedOrNull(values.reason),
          confirm_understanding: values.confirmUnderstanding,
        }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          return;
        }

        toast.error(errorMessage(responseData));
      },
      async (error) => {
        const responseData = error?.response?.data;

        if (responseData) {
          toast.error(errorMessage(responseData));
          return;
        }

        toast.error('An error occurred');
      }
    );

    return success;
  };

  /** Step 2 — confirm the emailed code and hand the request to the review queue. */
  const verifyCode = async (
    email: string,
    code: string
  ): Promise<AccountDeletionVerifiedData | null> => {
    let verified: AccountDeletionVerifiedData | null = null;

    await tryExecute(
      () =>
        doVerifyAccountDeletion.mutateAsync({
          email: email.trim(),
          code: code.trim(),
        }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success && responseData.data) {
          verified = responseData.data;
          return;
        }

        toast.error(errorMessage(responseData));
      },
      async (error) => {
        const responseData = error?.response?.data;

        if (responseData) {
          toast.error(errorMessage(responseData));
          return;
        }

        toast.error('An error occurred');
      }
    );

    return verified;
  };

  const resendCode = async (email: string): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doResendAccountDeletionOtp.mutateAsync({ email: email.trim() }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          toast.success(
            'If the code has not arrived yet, check your spam folder. We have sent another one.'
          );
          success = true;
          return;
        }

        toast.error(errorMessage(responseData));
      },
      async (error) => {
        const responseData = error?.response?.data;

        if (responseData) {
          toast.error(errorMessage(responseData));
          return;
        }

        toast.error('An error occurred');
      }
    );

    return success;
  };

  return {
    submitRequest,
    verifyCode,
    resendCode,
    isSubmitting: doRequestAccountDeletion.isPending,
    isVerifying: doVerifyAccountDeletion.isPending,
    isResending: doResendAccountDeletionOtp.isPending,
  };
};
