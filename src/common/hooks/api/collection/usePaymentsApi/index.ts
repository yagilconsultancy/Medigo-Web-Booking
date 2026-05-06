import { toast } from 'sonner';
import { useCreatePaymentIntent } from '../../mutation';
import type { ApiCreatePaymentIntentPayload } from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const usePaymentsApi = () => {
  const doCreatePaymentIntent = useCreatePaymentIntent();

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
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  return {
    createPaymentIntent,
    isCreatingPaymentIntent: doCreatePaymentIntent.isPending,
  };
};
