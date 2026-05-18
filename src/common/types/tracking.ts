export type DriverTrackingData = {
  id: string;
  ride_id: string;
  driver_id: string;
  rider_id: string;
  status: string;
  current_latitude: number;
  current_longitude: number;
  current_heading: number;
  current_speed: number;
  eta_minutes: number;
  distance_remaining_miles: number;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiDriverTrackingResponse = {
  success: boolean;
  message: string;
  data: DriverTrackingData | null;
};

// Socket event types
export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  RECONNECT = 'reconnect',
  RECONNECT_FAILED = 'reconnect_failed',
  JOIN_RIDE = 'join_ride',
  LEAVE_RIDE = 'leave_ride',
  JOIN_DISPATCH_CENTER = 'join_dispatch_center',
  LEAVE_DISPATCH_CENTER = 'leave_dispatch_center',
  LOCATION_UPDATE = 'location_update',
  DISPATCH_LOCATION_UPDATE = 'dispatch_location_update',
  TRACKING_STARTED = 'tracking_started',
  TRACKING_ENDED = 'tracking_ended',
}

export type DispatchLocationUpdate = {
  ride_id: string;
  driver_id: string;
  current_latitude: number;
  current_longitude: number;
  current_heading: number;
  current_speed: number;
  eta_minutes: number;
  distance_remaining_miles: number;
  status: string;
  timestamp: string;
};

export type RideLocationUpdate = {
  ride_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  eta_minutes: number;
  distance_remaining_miles: number;
  timestamp: string;
};

export type JoinRideResponse = {
  status: 'joined' | 'error';
  room?: string;
  error?: string;
};

export type TrackingStartedEvent = {
  ride_id: string;
  driver_id: string;
  rider_id: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  started_at: string;
};

export type TrackingEndedEvent = {
  ride_id: string;
  driver_id: string;
  completed_at: string;
  status: string;
};

export type JoinDispatchCenterResponse = {
  status: 'joined' | 'error';
  room?: string;
  message?: string;
};

export type MarkerPosition = {
  lat: number;
  lng: number;
};
