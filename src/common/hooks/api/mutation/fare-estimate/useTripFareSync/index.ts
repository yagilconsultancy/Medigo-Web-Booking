import { useEffect } from 'react';
import { BaseFareEstimateResponse } from '../../../../../types';
import { getBaseFareCombinedTotal } from '../../../../../utils';
import { useBaseFareEstimate } from '../useBaseFareEstimate';

type Coordinates = { lat: number; lng: number } | null;

export type TripFareSyncParams = {
  pickupAddress: string;
  dropoffAddress: string;
  pickupCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  serviceType: 'transport' | 'transport_assistant' | null;
  careAssistantFee: number | null;
  /** Selected vehicle's raw service_type (booking.vehicle.rideType). */
  rideType: string | null;
  tripType: 'one_way' | 'round_trip' | null;
  onResult: (result: { estimatedTotal: number; currency: string }) => void;
};

/**
 * Re-fetches the base-fare estimate with the current trip structure whenever
 * the trip type changes, then reports the selected vehicle's new total via
 * `onResult`. The server is the source of truth for round-trip pricing (the
 * fare engine adds the return leg), so no fare math is duplicated on the client.
 *
 * Guards keep it inert until a vehicle is selected and addresses/coordinates
 * are present; on any miss (no match, error) it leaves the previous total
 * untouched rather than clearing it, so the displayed price never flickers.
 */
export const useTripFareSync = ({
  pickupAddress,
  dropoffAddress,
  pickupCoordinates,
  dropoffCoordinates,
  serviceType,
  careAssistantFee,
  rideType,
  tripType,
  onResult,
}: TripFareSyncParams) => {
  const { mutateAsync: createBaseFareEstimate, isPending } =
    useBaseFareEstimate();

  useEffect(() => {
    const run = async () => {
      if (!rideType || !tripType) return;
      if (!pickupCoordinates || !dropoffCoordinates) return;
      if (!pickupAddress || !dropoffAddress) return;

      try {
        const response = await createBaseFareEstimate({
          pickup_address: pickupAddress,
          pickup_latitude: pickupCoordinates.lat,
          pickup_longitude: pickupCoordinates.lng,
          destination_address: dropoffAddress,
          destination_latitude: dropoffCoordinates.lat,
          destination_longitude: dropoffCoordinates.lng,
          trip_structure: tripType,
        });

        const data = (response.data as { data: BaseFareEstimateResponse }).data;
        const estimate = data.estimates.find(
          (item) => item.service_type === rideType
        );
        if (!estimate) return;

        onResult({
          estimatedTotal: getBaseFareCombinedTotal(estimate, {
            serviceType,
            careAssistantFee,
          }),
          currency: data.currency,
        });
      } catch (error) {
        console.error(error);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tripType,
    rideType,
    pickupAddress,
    dropoffAddress,
    pickupCoordinates?.lat,
    pickupCoordinates?.lng,
    dropoffCoordinates?.lat,
    dropoffCoordinates?.lng,
    serviceType,
    careAssistantFee,
  ]);

  return { isPending };
};
