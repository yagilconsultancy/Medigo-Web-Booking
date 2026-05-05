export const locationTracker = {
  EN_ROUTE_PICKUP: 'EN_ROUTE_PICKUP',
  ARRIVED_PICKUP: 'ARRIVED_PICKUP',
  LOADING_IN_PROGRESS: 'LOADING_IN_PROGRESS',
  PICKUP_COMPLETED: 'PICKUP_COMPLETED',
  IN_TRANSIT: 'IN_TRANSIT',
  ARRIVED_DELIVERY: 'ARRIVED_DELIVERY',
  UNLOADING_IN_PROGRESS: 'UNLOADING_IN_PROGRESS',
  DELIVERY_COMPLETED: 'DELIVERY_COMPLETED',
  AWAITING_VERIFICATION: 'AWAITING_VERIFICATION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
};
export const trackLocation = ['In Transit', 'Completed', 'Cancelled', 'Failed'];

export const statusMapping = {
  'In Transit': [
    locationTracker.EN_ROUTE_PICKUP,
    locationTracker.ARRIVED_PICKUP,
    locationTracker.LOADING_IN_PROGRESS,
    locationTracker.PICKUP_COMPLETED,
    locationTracker.IN_TRANSIT,
    locationTracker.ARRIVED_DELIVERY,
    locationTracker.UNLOADING_IN_PROGRESS,
    locationTracker.DELIVERY_COMPLETED,
    locationTracker.AWAITING_VERIFICATION,
  ],
  Completed: [locationTracker.COMPLETED],
  Cancelled: [locationTracker.CANCELLED],
  Failed: [locationTracker.FAILED],
};
