import { UseQueryResult } from '@tanstack/react-query';
import { ApiResponse } from '../../../types';

/**
 * Represents the result of a resolved API query, adapting the structure of
 * the UseQueryResult to provide a simplified data type.
 *
 * @template Data - The type of the resolved data being queried.
 * @template Error - The type of the error object, defaults to `unknown` if not specified.
 */
export type UseResolvedApiQueryResult<Data, Error = unknown> = Omit<
  UseQueryResult<ApiResponse<Data>, Error>,
  'data'
> & {
  data: Data;
};

/**
 * A utility function that simplifies resolving API query results by extracting successful data
 * or returning a default value in case the API response is not successful.
 *
 * @template Data The expected type of the data returned by the API in a successful response.
 * @template Error The type of the error that may occur during the query. Defaults to `unknown`.
 * @template Args The type of arguments accepted by the query hook.
 *
 * @param queryHook
 * A React Query hook function that executes the API query and returns an object containing
 * the query status and result.
 *
 * @param defaultValue
 * The fallback value is used when the API response is not successful or data is unavailable.
 *
 * @param args
 * Additional arguments to be passed to the query hook.
 *
 * @returns
 * An object containing the resolved query result, where the `data` property is the successfully
 * resolved data or the provided default value.
 */
export const useResolvedApiQuery = <
  Data,
  Error = unknown,
  Args extends any[] = [],
>(
  queryHook: (...args: Args) => UseQueryResult<ApiResponse<Data>, Error>,
  defaultValue: Data,
  ...args: Args
): UseResolvedApiQueryResult<Data, Error> => {
  const queryResult = queryHook(...args);
  const { data: apiResponse, error, ...rest } = queryResult;

  const resolvedData =
    apiResponse && apiResponse.success ? apiResponse.data : defaultValue;

  return {
    ...rest,
    data: resolvedData,
    error: error as Error,
  };
};
