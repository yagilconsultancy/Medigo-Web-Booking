import { ApiResponse } from './common';

export type ApiFareEstimateRequest = {
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  scheduled_at?: string;
  use_highway_407?: boolean;
  highway_407_route?: string;
  is_dialysis_trip?: boolean;
  ride_type?: string;
  trip_type?: string;
  trip_structure?: string;
};

export type ApiBaseFareEstimateRequest = {
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
};

export interface BaseFareEstimateResponse {
  distance_km: number;
  estimates: [
    {
      service_type: string;
      display_name: string;
      base_fare: number;
      distance_charge: number;
      estimated_total: number;
      description: string;
      passengers: string;
      best_for: string;
      features: string[];
    },
  ];
  currency: string;
  note: string;
  estimated_at: string;
}

export interface FareEstimateResponse {
  distance_km: number;
  distance_miles: number;
  duration_minutes: number;
  base_fare: number;
  distance_charge: number;
  wait_time_charge: number;
  surcharges_total: number;
  surcharges_capped: number;
  surcharge_details: [{ type: string; name: string; amount: number }];
  highway_407_toll: number;
  insurance_gateway_fee: number;
  flat_surcharge: number;
  platform_fee: number;
  total_fare: number;
  driver_earnings: number;
  is_dialysis_rate: boolean;
  rate_card_version: number;
  care_assistant_fee: number;
  accessibility_fee: number;
  attendant_fee: number;
  is_round_trip: boolean;
  return_distance_charge: number;
  ride_type: string;
  trip_type: string;
  currency: string;
  estimated_at: string;
}

export type ApiBaseFareEstimateResponse = ApiResponse<BaseFareEstimateResponse>;
export type ApiFareEstimateResponse = ApiResponse<FareEstimateResponse>;
