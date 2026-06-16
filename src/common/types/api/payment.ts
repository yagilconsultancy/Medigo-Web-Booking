import { ApiResponse } from './common';

export type ApiCreatePaymentIntentPayload = {
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  metadata?: Record<string, string>;
  customer_session_api_version?: string;
  setup_future_usage?: 'on_session' | 'off_session';
};

export type ApiCreatePaymentIntentData = {
  payment_intent: string;
  payment_intent_id: string;
  customer: string;
  ephemeral_key: string;
  publishable_key: string;
  amount: number;
  currency: string;
};

export type ApiCreatePaymentIntentResponse =
  ApiResponse<ApiCreatePaymentIntentData>;

export type ApiCreateGuestPaymentIntentPayload = {
  session_id: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  metadata?: Record<string, string>;
};

export type ApiCreateGuestPaymentIntentData = {
  payment_intent: string;
  payment_intent_id: string;
  customer: string;
  ephemeral_key: string;
  publishable_key: string;
  amount: number;
  currency: string;
};

export type ApiCreateGuestPaymentIntentResponse =
  ApiResponse<ApiCreateGuestPaymentIntentData>;
