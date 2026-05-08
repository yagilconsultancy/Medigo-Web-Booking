import { useQuery } from '@tanstack/react-query';
import { listEmergencyContacts } from '../../../../../services/api';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useListEmergencyContacts = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listEmergencyContacts)],
    queryFn: () => listEmergencyContacts().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount) => failureCount < 3,
  });
};
