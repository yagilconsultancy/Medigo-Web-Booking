import type {
  ApiPaginatedResponse,
  ApiPaginatedResponseData,
  ApiResponse,
} from './common';

// ====================== HEALTH / INTERNAL (untyped responses) ======================

export type ApiHealthLiveResponse = any;
export type ApiHealthReadyResponse = any;

export type ApiInternalResponse = any;

// ====================== RIDES ======================

export type ApiRideType =
  | 'ambulatory'
  | 'standard'
  | 'wheelchair'
  | 'stretcher';
export type ApiTripType =
  | 'transport_only'
  | 'transport_care_assistant'
  | 'transport_escort';
export type ApiTripStructure = 'one_way' | 'round_trip';

export type ApiCreateRidePayload = {
  ride_type: ApiRideType;
  trip_type?: ApiTripType;
  trip_structure?: ApiTripStructure;
  pickup_address: string;
  pickup_latitude?: number | null;
  pickup_longitude?: number | null;
  destination_address: string;
  destination_latitude?: number | null;
  destination_longitude?: number | null;
  scheduled_at: string; // ISO
  passenger_id?: string | null;
  passenger_first_name?: string | null;
  passenger_last_name?: string | null;
  passenger_phone?: string | null;
  visit_type?: string | null;
  appointment_time?: string | null; // ISO
  facility_name?: string | null;
  special_instructions?: string | null;
  mobility_level?: string | null;
  assistance_level?: string | null;
  estimated_distance_miles?: number | null;
  estimated_duration_minutes?: number | null;
  estimated_fare?: number | null;
  business_id?: string | null;
  use_highway_407?: boolean;
  highway_407_route?: string | null;
  is_dialysis_trip?: boolean;
  booking_channel?: string;
  recurring_frequency?: 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | null;
  recurring_days_of_week?: number[] | null;
  recurring_end_date?: string | null; // YYYY-MM-DD
};

export type ApiRide = {
  id: string;
  rider_id: string;
  driver_id: string | null;
  caregiver_id: string | null;
  business_id: string | null;
  ride_type: string;
  trip_type: string;
  trip_structure: string;
  pickup_address: string;
  destination_address: string;
  scheduled_at: string; // ISO
  status: string;
  passenger_id: string | null;
  passenger_first_name: string | null;
  passenger_last_name: string | null;
  passenger_phone: string | null;
  estimated_distance_miles: number | null;
  estimated_duration_minutes: number | null;
  estimated_fare: number | null;
  final_fare: number | null;
  special_instructions: string | null;
  visit_type: string | null;
  facility_name: string | null;
  booking_channel: string;
  facility_id: string | null;
  guest_session_id: string | null;
  recurring_ride_id: string | null;
  use_highway_407: boolean;
  highway_407_route: string | null;
  is_dialysis_trip: boolean;
  created_at: string; // ISO
  rider_name: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  driver_avatar_url: string | null;
  driver_rating: number | null;
  driver_vehicle_type: string | null;
  driver_vehicle_make: string | null;
  driver_vehicle_model: string | null;
  driver_vehicle_color: string | null;
  driver_vehicle_plate: string | null;
};
export type ApiRideOverview = {
  summary: {
    total_rides: number;
    completed_rides: number;
    cancelled_rides: number;
    miles_traveled: number;
  };
  stats: {
    total_rides: number;
    miles_traveled: number;
    average_rating_given: number;
    member_since: string;
  };
  rides: ApiRide[];
  filtered_total: number;
  page: number;
  limit: number;
  total_pages: number;
  status_filter: string;
};

export type ApiRiderStats = {
  total_rides: number;
  miles_traveled: number;
  average_rating_given: number;
  member_since: string;
};

export type ApiStatusLog = {
  id: string;
  ride_id: string;
  status: string;
  changed_at: string; // ISO
  notes: string | null;
};

export type ApiRating = {
  id: string;
  ride_id: string;
  rated_user_id: string;
  rated_by_user_id: string;
  rating_type: string;
  rating: number;
  comment: string | null;
  created_at: string; // ISO
};

export type ApiDriverContact = {
  driver_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string | null;
  rating: number;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_color: string;
};

export type ApiRideDetail = {
  id: string;
  rider_id: string;
  driver_id: string | null;
  caregiver_id: string | null;
  business_id: string | null;
  ride_type: string;
  trip_type: string;
  trip_structure: string;
  pickup_address: string;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  destination_address: string;
  destination_latitude: number | null;
  destination_longitude: number | null;
  scheduled_at: string; // ISO
  pickup_at: string | null; // ISO
  dropoff_at: string | null; // ISO
  status: string;
  passenger_id: string | null;
  passenger_first_name: string | null;
  passenger_last_name: string | null;
  passenger_phone: string | null;
  estimated_distance_miles: number | null;
  actual_distance_miles: number | null;
  estimated_duration_minutes: number | null;
  actual_duration_minutes: number | null;
  estimated_fare: number | null;
  final_fare: number | null;
  visit_type: string | null;
  appointment_time: string | null; // ISO
  facility_name: string | null;
  booking_channel: string;
  facility_id: string | null;
  guest_session_id: string | null;
  recurring_ride_id: string | null;
  special_instructions: string | null;
  mobility_level: string | null;
  assistance_level: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null; // ISO
  use_highway_407: boolean;
  highway_407_route: string | null;
  is_dialysis_trip: boolean;
  created_at: string; // ISO
  rider_name: string;
  rider_rating: number;
  rider_trip_count: number;
  driver_rating: ApiRating | null;
  rider_rating_given: ApiRating | null;
  timeline: ApiStatusLog[];
};

export type ApiCancelRidePayload = {
  ride_id?: string | null;
  reason?: string | null;
  notes?: string | null;
};

export type ApiRebookRidePayload = {
  scheduled_at: string; // ISO
  trip_structure?: ApiTripStructure;
};

export type ApiSubmitRatingPayload = {
  rating_type: string;
  rating: number;
  comment?: string | null;
};

export type ApiStatusTransitionPayload = {
  new_status: string;
  notes?: string | null;
};

export type ApiShareRide = {
  share_token: string;
  share_url: string;
  expires_at: string | null; // ISO
};

export type ApiSharedRide = {
  ride: ApiRideDetail;
};

export type ApiCreateRecurringRidePayload = Record<string, any>;
export type ApiRecurringRide = Record<string, any>;

export type ApiCreateGuestSessionPayload = Record<string, any>;
export type ApiGuestSession = Record<string, any>;

export type ApiCreateGuestBookingPayload = Record<string, any>;
export type ApiGuestBooking = Record<string, any>;

export type ApiCreateSafetyReportPayload = {
  reported_user_id?: string | null;
  ride_id?: string | null;
  report_type: string;
  description: string;
};

export type ApiSafetyReport = Record<string, any>;

export type ApiSubmitVehicleChecklistPayload = Record<string, any>;
export type ApiVehicleChecklist = Record<string, any>;

// Analytics response shapes (kept flexible; schemas are nested)
export type ApiDashboardKpis = Record<string, any>;
export type ApiTripVolumeTrend = Record<string, any>;
export type ApiTripStatusDistribution = Record<string, any>;
export type ApiTransportDistribution = Record<string, any>;
export type ApiBookingChannels = Record<string, any>;
export type ApiServiceQuality = Record<string, any>;
export type ApiTopFacilities = Record<string, any>;
export type ApiTopFleetPartners = Record<string, any>;
export type ApiRecentActivity = Record<string, any>;
export type ApiPublicBookingConfig = Record<string, any>;

// Internal request payloads
export type ApiBatchRiderActivityPayload = Record<string, any>;
export type ApiUpdateFarePayload = Record<string, any>;

// ====================== API RESPONSES ======================

export type ApiRideResponse = ApiResponse<ApiRide>;
export type ApiRideDetailResponse = ApiResponse<ApiRideDetail>;
export type ApiRideFareResponse = ApiResponse<Record<string, any>>;

export type ApiRideRatingResponse = ApiResponse<ApiRating>;
export type ApiRideRatingsResponse = ApiResponse<ApiRating[]>;
export type ApiDriverContactResponse = ApiResponse<ApiDriverContact>;
export type ApiRideTimelineResponse = ApiResponse<ApiStatusLog[]>;

export type ApiShareRideResponse = ApiResponse<ApiShareRide>;
export type ApiSharedRideResponse = ApiResponse<ApiSharedRide>;

export type ApiRecurringRideResponse = ApiResponse<ApiRecurringRide>;
export type ApiRecurringRidesResponse = ApiResponse<ApiRecurringRide[]>;

export type ApiGuestSessionResponse = ApiResponse<ApiGuestSession>;
export type ApiGuestBookingResponse = ApiResponse<ApiGuestBooking>;

export type ApiSafetyReportResponse = ApiResponse<ApiSafetyReport>;
export type ApiSafetyReportsResponse = ApiPaginatedResponse<ApiSafetyReport>;

export type ApiVehicleChecklistResponse = ApiResponse<ApiVehicleChecklist>;
export type ApiVehicleChecklistsResponse = ApiResponse<ApiVehicleChecklist[]>;

export type ApiMyRidesResponse = ApiResponse<ApiRideOverview>;
export type ApiMyActiveRideResponse = ApiResponse<ApiRide | null>;
export type ApiRiderStatsResponse = ApiResponse<ApiRiderStats>;

export type ApiDashboardOverviewResponse = ApiResponse<ApiDashboardKpis>;
export type ApiTripVolumeTrendResponse = ApiResponse<ApiTripVolumeTrend>;
export type ApiTripStatusDistributionResponse =
  ApiResponse<ApiTripStatusDistribution>;
export type ApiTransportDistributionResponse =
  ApiResponse<ApiTransportDistribution>;
export type ApiBookingChannelsResponse = ApiResponse<ApiBookingChannels>;
export type ApiServiceQualityResponse = ApiResponse<ApiServiceQuality>;
export type ApiTopFacilitiesResponse = ApiResponse<ApiTopFacilities>;
export type ApiTopFleetPartnersResponse = ApiResponse<ApiTopFleetPartners>;
export type ApiRecentActivityResponse = ApiResponse<ApiRecentActivity>;
export type ApiPublicBookingConfigResponse =
  ApiResponse<ApiPublicBookingConfig>;
