import { toast } from 'sonner';
import {
  useAdvanceOnboarding,
  useCreateEmergencyContact,
  useCreatePassenger,
  useCreateSavedLocation,
  useDeleteEmergencyContact,
  useDeletePassenger,
  useDeleteSavedLocation,
  useReorderSavedLocations,
  useUpdateAppSettings,
  useUpdateMyConsent,
  useUpdateMyProfile,
  useUpdateNotificationSettings,
  useUpdatePassenger,
  useUpdatePrivacySettings,
  useUpdateSavedLocation,
  useUploadAvatar,
  useUploadMyDocument,
} from '../../mutation';
import type {
  ApiCreateSavedLocationPayload,
  ApiEmergencyContactCreatePayload,
  ApiPassengerCreatePayload,
  ApiPassengerUpdatePayload,
  ApiReorderSavedLocationsPayload,
  ApiUpdateAppSettingsPayload,
  ApiUpdateConsentPayload,
  ApiUpdateMyProfilePayload,
  ApiUpdateNotificationSettingsPayload,
  ApiUpdatePrivacySettingsPayload,
  ApiUpdateSavedLocationPayload,
  ApiUploadAvatarPayload,
  ApiUploadMyDocumentPayload,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useUsersMeApi = () => {
  const doUpdateMyProfile = useUpdateMyProfile();
  const doCreateEmergencyContact = useCreateEmergencyContact();
  const doDeleteEmergencyContact = useDeleteEmergencyContact();
  const doUpdateMyConsent = useUpdateMyConsent();
  const doAdvanceOnboarding = useAdvanceOnboarding();
  const doUploadMyDocument = useUploadMyDocument();
  const doUploadAvatar = useUploadAvatar();
  const doCreatePassenger = useCreatePassenger();
  const doUpdatePassenger = useUpdatePassenger();
  const doDeletePassenger = useDeletePassenger();
  const doUpdateNotificationSettings = useUpdateNotificationSettings();
  const doUpdatePrivacySettings = useUpdatePrivacySettings();
  const doUpdateAppSettings = useUpdateAppSettings();
  const doCreateSavedLocation = useCreateSavedLocation();
  const doUpdateSavedLocation = useUpdateSavedLocation();
  const doDeleteSavedLocation = useDeleteSavedLocation();
  const doReorderSavedLocations = useReorderSavedLocations();

  const updateMyProfile = async (payload: ApiUpdateMyProfilePayload) => {
    return await tryExecute(
      () => doUpdateMyProfile.mutateAsync(payload),
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

  const createEmergencyContact = async (
    payload: ApiEmergencyContactCreatePayload
  ) => {
    return await tryExecute(
      () => doCreateEmergencyContact.mutateAsync(payload),
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

  const deleteEmergencyContact = async (contactId: string) => {
    return await tryExecute(
      () => doDeleteEmergencyContact.mutateAsync({ contactId }),
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

  const updateMyConsent = async (payload: ApiUpdateConsentPayload) => {
    return await tryExecute(
      () => doUpdateMyConsent.mutateAsync(payload),
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

  const advanceOnboarding = async (step: string) => {
    return await tryExecute(
      () => doAdvanceOnboarding.mutateAsync({ step }),
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

  const uploadMyDocument = async (payload: ApiUploadMyDocumentPayload) => {
    return await tryExecute(
      () => doUploadMyDocument.mutateAsync(payload),
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

  const uploadAvatar = async (payload: ApiUploadAvatarPayload) => {
    return await tryExecute(
      () => doUploadAvatar.mutateAsync(payload),
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

  const createPassenger = async (payload: ApiPassengerCreatePayload) => {
    return await tryExecute(
      () => doCreatePassenger.mutateAsync(payload),
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

  const updatePassenger = async (
    payload: { passengerId: string } & ApiPassengerUpdatePayload
  ) => {
    return await tryExecute(
      () => doUpdatePassenger.mutateAsync(payload),
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

  const deletePassenger = async (passengerId: string) => {
    return await tryExecute(
      () => doDeletePassenger.mutateAsync({ passengerId }),
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

  const updateNotificationSettings = async (
    payload: ApiUpdateNotificationSettingsPayload
  ) => {
    return await tryExecute(
      () => doUpdateNotificationSettings.mutateAsync(payload),
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

  const updatePrivacySettings = async (
    payload: ApiUpdatePrivacySettingsPayload
  ) => {
    return await tryExecute(
      () => doUpdatePrivacySettings.mutateAsync(payload),
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

  const updateAppSettings = async (payload: ApiUpdateAppSettingsPayload) => {
    return await tryExecute(
      () => doUpdateAppSettings.mutateAsync(payload),
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

  const createSavedLocation = async (
    payload: ApiCreateSavedLocationPayload
  ) => {
    return await tryExecute(
      () => doCreateSavedLocation.mutateAsync(payload),
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

  const updateSavedLocation = async (
    payload: { locationId: string } & ApiUpdateSavedLocationPayload
  ) => {
    return await tryExecute(
      () => doUpdateSavedLocation.mutateAsync(payload),
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

  const deleteSavedLocation = async (locationId: string) => {
    return await tryExecute(
      () => doDeleteSavedLocation.mutateAsync({ locationId }),
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

  const reorderSavedLocations = async (
    payload: ApiReorderSavedLocationsPayload
  ) => {
    return await tryExecute(
      () => doReorderSavedLocations.mutateAsync(payload),
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
    updateMyProfile,
    createEmergencyContact,
    deleteEmergencyContact,
    updateMyConsent,
    advanceOnboarding,
    uploadMyDocument,
    uploadAvatar,
    createPassenger,
    updatePassenger,
    deletePassenger,
    updateNotificationSettings,
    updatePrivacySettings,
    updateAppSettings,
    createSavedLocation,
    updateSavedLocation,
    deleteSavedLocation,
    reorderSavedLocations,
  };
};
