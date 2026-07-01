import { BaseFareEstimateResponse } from '../types';

type BaseFareEstimateItem = BaseFareEstimateResponse['estimates'][number];

type CombinedTotalContext = {
  serviceType: 'transport' | 'transport_assistant' | null;
  careAssistantFee: number | null;
};

/**
 * Combined base-estimate total for a single vehicle, including the
 * care-assistant fee when the transport-assistant service is selected.
 *
 * Single source of the estimate math shared by the Vehicle step (per-card
 * price) and the Trip step (round-trip re-price), so the two stay consistent.
 */
export const getBaseFareCombinedTotal = (
  estimate: BaseFareEstimateItem,
  { serviceType, careAssistantFee }: CombinedTotalContext
): number => {
  const fee =
    serviceType === 'transport_assistant' ? (careAssistantFee ?? 0) : 0;
  return estimate.estimated_total + fee;
};
