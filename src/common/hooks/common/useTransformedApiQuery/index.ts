import { UseQueryResult } from '@tanstack/react-query';
import { ApiQueryHook } from '../../../types';
import { useResolvedApiQuery } from '../useResolvedApiQuery';

/**
 * Represents a transformed API query result.
 *
 * This utility type is useful for scenarios where the raw data returned from an API
 * needs to be transformed or mapped into a specific structure represented by the "View" type.
 *
 * @template View - The type representing the transformed structure of the query result's data.
 * @template Error - The type representing the possible error structure. Defaults to unknown.
 */
export type TransformedApiQuery<View, Error = unknown> = Omit<
  UseQueryResult<unknown, Error>,
  'data'
> & { data: View };

/**
 * A custom hook that transforms the result of an API query into a specified view type.
 * It uses a provided transformation function to map the raw API response data to the desired structure.
 *
 * @param options - An object containing the configuration for the transformed query hook.
 * @param options.queryHook - The original query hook that retrieves raw API data.
 * @param options.hookArgs - The arguments to pass to the original query hook. The type of these arguments is inferred from the queryHook.
 * @param options.transform - A transformation function to map raw data to the desired view type.
 * @param options.defaultValue - The default value to use when the data is null or undefined.
 *
 * @return An object containing the transformed API query data and associated metadata, such as loading and error states.
 */
export function useTransformedApiQuery<
  Raw,
  View,
  Error = unknown,
  QueryHook extends ApiQueryHook<Raw, any[], Error> = ApiQueryHook<
    Raw,
    any[],
    Error
  >,
>(options: {
  queryHook: QueryHook;
  hookArgs: Parameters<QueryHook>;
  transform: (raw: Raw) => View;
  defaultValue: View;
}): TransformedApiQuery<View, Error> {
  const { queryHook, hookArgs, transform, defaultValue } = options;

  const raw = queryHook(...hookArgs);
  const unwrapped = useResolvedApiQuery<Raw, Error>(
    () => raw,
    undefined as unknown as Raw
  );

  const data =
    unwrapped.data != null ? transform(unwrapped.data) : defaultValue;

  return { ...unwrapped, data };
}
