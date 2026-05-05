import { ApiResponse } from './common';

export type ReopenTicketPayload = {
  ticketId: string;
};

export type ResolveTicketPayload = {
  ticketId: string;
  resolution_note?: string;
};

export type ApiSupportTicketActionResponse = ApiResponse<null>;
