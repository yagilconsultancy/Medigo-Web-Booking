import { AxiosResponse } from 'axios';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getApiClient } from '../../../../lib';
import {
  ApiSupportTicketActionResponse,
  ReopenTicketPayload,
  ResolveTicketPayload,
} from '../../../../types';

export const reopenTicket = async (payload: ReopenTicketPayload) => {
  return await getApiClient().put<
    ApiSupportTicketActionResponse,
    AxiosResponse<ApiSupportTicketActionResponse>
  >(resolveRoute(ROUTES.reopenTicket, payload.ticketId));
};

export const resolveTicket = async (payload: ResolveTicketPayload) => {
  const { ticketId, ...body } = payload;
  return await getApiClient().put<
    ApiSupportTicketActionResponse,
    AxiosResponse<ApiSupportTicketActionResponse>
  >(resolveRoute(ROUTES.resolveTicket, ticketId), body);
};
