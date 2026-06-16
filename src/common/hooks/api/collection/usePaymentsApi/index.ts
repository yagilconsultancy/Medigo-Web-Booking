import { toast } from 'sonner';
import {
  useCreateGuestPaymentIntent,
  useCreatePaymentIntent,
} from '../../mutation';
import type {
  ApiCreateGuestPaymentIntentData,
  ApiCreateGuestPaymentIntentPayload,
  ApiCreatePaymentIntentPayload,
} from '../../../../types';
import {
  extractApiErrorMessage,
  extractResponseErrors,
  tryExecute,
} from '../../../../utils';

export const usePaymentsApi = () => {
  const doCreatePaymentIntent = useCreatePaymentIntent();
  const doCreateGuestPaymentIntent = useCreateGuestPaymentIntent();

  const createPaymentIntent = async (
    payload: ApiCreatePaymentIntentPayload
  ): Promise<{ clientSecret: string; publishableKey: string } | null> => {
    return await tryExecute(
      () => doCreatePaymentIntent.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          const clientSecret = responseData.data?.payment_intent ?? '';
          const publishableKey = responseData.data?.publishable_key ?? '';

          if (!clientSecret || !publishableKey) {
            toast.error('Payment initialization response is incomplete');
            return null;
          }

          if (responseData.message) {
            toast.success(responseData.message);
          }

          return { clientSecret, publishableKey };
        }

        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return null;
      }
    );
  };

  const createGuestPaymentIntent = async (
    payload: ApiCreateGuestPaymentIntentPayload
  ): Promise<ApiCreateGuestPaymentIntentData | null> => {
    return await tryExecute(
      () => doCreateGuestPaymentIntent.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          if (!responseData.data) {
            toast.error('Guest payment initialization response is incomplete');
            return null;
          }

          if (responseData.message) {
            toast.success(responseData.message);
          }

          return responseData.data;
        }

        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async (error) => {
        toast.error(extractApiErrorMessage(error));
        return null;
      }
    );
  };

  return {
    createPaymentIntent,
    createGuestPaymentIntent,
    isCreatingPaymentIntent: doCreatePaymentIntent.isPending,
    isCreatingGuestPaymentIntent: doCreateGuestPaymentIntent.isPending,
  };
};
