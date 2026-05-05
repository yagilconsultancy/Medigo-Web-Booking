import { UseQueryResult } from '@tanstack/react-query';

/**
 * A success response from the API.
 */
export interface ApiSuccessResponse<T = any> {
  success: boolean;
  message?: string | null;
  data: T | null;
}

/**
 * A paginated response data structure for API responses.
 */
export interface ApiPaginatedResponseData<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: any;
  ctx?: Record<string, any>;
}

/**
 * An error response from the API.
 */
export type ApiErrorResponse = {
  success: false;
  error: string | string[];
};

/**
 * A response from the API.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * A payload for a paginated API request.
 */
export type ApiPaginatedPayload<Filters, SortBy extends string = string> = {
  page?: number;
  limit?: number;
  filters?: Filters;
  sortBy?: SortBy;
};

/**
 * A response for a paginated API request.
 */
export type ApiPaginatedResponse<ResponseItemData> = ApiResponse<
  ApiPaginatedResponseData<ResponseItemData>
>;

/**
 * Extracts the data from an API response when the request is successful.
 */
export type ExtractApiSuccessResponseData<T extends ApiResponse<any>> = Extract<
  T,
  { success: true }
>['data'];

/**
 * A hook that returns the result of an API query.
 */
export type ApiQueryHook<Data, Args extends any[] = any[], Error = unknown> = (
  ...args: Args
) => UseQueryResult<ApiResponse<Data>, Error>;

export enum EarningsPeriodEnum {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  LAST_3_MONTHS = 'last_3_months',
  THIS_QUARTER = 'this_quarter',
  LAST_QUARTER = 'last_quarter',
  THIS_YEAR = 'this_year',
  LAST_YEAR = 'last_year',
  YTD = 'ytd',
  QTD = 'qtd',
  ALL_TIME = 'all_time',
}
