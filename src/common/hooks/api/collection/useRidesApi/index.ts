import { toast } from 'sonner';
import {
  useCancelRide,
  useCreateGuestBooking,
  useCreateGuestSession,
  useCreateRecurringRide,
  useCreateRide,
  useCreateSafetyReport,
  useDeactivateRecurringRide,
  useInternalBatchRiderActivity,
  useInternalUpdateRideFare,
  useRebookRide,
  useShareRide,
  useSubmitRideRating,
  useSubmitVehicleChecklist,
  useTransitionRideStatus,
} from '../../mutation';
import type {
  ApiBatchRiderActivityPayload,
  ApiCancelRidePayload,
  ApiCreateGuestBookingPayload,
  ApiCreateGuestSessionPayload,
  ApiCreateRecurringRidePayload,
  ApiCreateRidePayload,
  ApiCreateSafetyReportPayload,
  ApiRebookRidePayload,
  ApiStatusTransitionPayload,
  ApiSubmitRatingPayload,
  ApiSubmitVehicleChecklistPayload,
  ApiUpdateFarePayload,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useRidesApi = () => {
  const doInternalBatchRiderActivity = useInternalBatchRiderActivity();
  const doInternalUpdateRideFare = useInternalUpdateRideFare();
  const doCreateRide = useCreateRide();
  const doCancelRide = useCancelRide();
  const doSubmitRideRating = useSubmitRideRating();
  const doRebookRide = useRebookRide();
  const doShareRide = useShareRide();
  const doTransitionRideStatus = useTransitionRideStatus();
  const doCreateGuestSession = useCreateGuestSession();
  const doCreateGuestBooking = useCreateGuestBooking();
  const doCreateRecurringRide = useCreateRecurringRide();
  const doDeactivateRecurringRide = useDeactivateRecurringRide();
  const doCreateSafetyReport = useCreateSafetyReport();
  const doSubmitVehicleChecklist = useSubmitVehicleChecklist();

  const internalBatchRiderActivity = async (payload: {
    body: ApiBatchRiderActivityPayload;
    xInternalService?: string | null;
  }) => {
    return await tryExecute(
      () => doInternalBatchRiderActivity.mutateAsync(payload),
      async () => true,
      async () => {
        toast.error('An error occurred');
        return false;
      }
    );
  };

  const internalUpdateRideFare = async (payload: {
    rideId: string;
    body: ApiUpdateFarePayload;
    xInternalService?: string | null;
  }) => {
    return await tryExecute(
      () => doInternalUpdateRideFare.mutateAsync(payload),
      async () => true,
      async () => {
        toast.error('An error occurred');
        return false;
      }
    );
  };

  const createRide = async (payload: ApiCreateRidePayload) => {
    return await tryExecute(
      () => doCreateRide.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const cancelRide = async (rideId: string, body: ApiCancelRidePayload) => {
    return await tryExecute(
      () => doCancelRide.mutateAsync({ rideId, body }),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const submitRideRating = async (
    rideId: string,
    body: ApiSubmitRatingPayload
  ) => {
    return await tryExecute(
      () => doSubmitRideRating.mutateAsync({ rideId, body }),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const rebookRide = async (rideId: string, body: ApiRebookRidePayload) => {
    return await tryExecute(
      () => doRebookRide.mutateAsync({ rideId, body }),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const shareRide = async (rideId: string) => {
    return await tryExecute(
      () => doShareRide.mutateAsync({ rideId }),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const transitionRideStatus = async (
    rideId: string,
    body: ApiStatusTransitionPayload
  ) => {
    return await tryExecute(
      () => doTransitionRideStatus.mutateAsync({ rideId, body }),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const createGuestSession = async (payload: ApiCreateGuestSessionPayload) => {
    return await tryExecute(
      () => doCreateGuestSession.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const createGuestBooking = async (payload: ApiCreateGuestBookingPayload) => {
    return await tryExecute(
      () => doCreateGuestBooking.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const createRecurringRide = async (
    payload: ApiCreateRecurringRidePayload
  ) => {
    return await tryExecute(
      () => doCreateRecurringRide.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const deactivateRecurringRide = async (recurringRideId: string) => {
    return await tryExecute(
      () => doDeactivateRecurringRide.mutateAsync({ recurringRideId }),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return true;
        toast.error(extractResponseErrors(responseData));
        return false;
      },
      async () => {
        toast.error('An error occurred');
        return false;
      }
    );
  };

  const createSafetyReport = async (payload: ApiCreateSafetyReportPayload) => {
    return await tryExecute(
      () => doCreateSafetyReport.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
        toast.error(extractResponseErrors(responseData));
        return null;
      },
      async () => {
        toast.error('An error occurred');
        return null;
      }
    );
  };

  const submitVehicleChecklist = async (
    payload: ApiSubmitVehicleChecklistPayload
  ) => {
    return await tryExecute(
      () => doSubmitVehicleChecklist.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) return responseData.data;
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
    internalBatchRiderActivity,
    internalUpdateRideFare,
    createRide,
    cancelRide,
    submitRideRating,
    rebookRide,
    shareRide,
    transitionRideStatus,
    createGuestSession,
    createGuestBooking,
    createRecurringRide,
    deactivateRecurringRide,
    createSafetyReport,
    submitVehicleChecklist,
  };
};
