import { ReactNode } from 'react';
import { ApiResponse } from '../types';

export const extractResponseErrors = (
  apiResponse: ApiResponse<any>
): ReactNode => {
  if (apiResponse.success) {
    return null;
  }

  // Prefer structured `error` array/string, but fall back to `message`.
  // @ts-ignore
  const messageFallback = apiResponse?.message ?? null;
  // @ts-ignore
  const rawError = apiResponse?.error ?? null;

  if (!rawError) {
    return messageFallback || 'An error occurred';
  }
  // @ts-ignore
  const errors = Array.isArray(rawError)
    ? // @ts-ignore
      rawError
    : // @ts-ignore
      [rawError];
  if (errors.length === 1) {
    return errors[0];
  }

  const errorNodes: ReactNode[] = errors.map((error, index) => (
    <li key={index}>{error}</li>
  ));

  return <ul>{errorNodes}</ul>;
};

export const extractApiErrorMessage = (
  error: unknown,
  fallback: ReactNode = 'An error occurred'
): ReactNode => {
  const maybeAxiosResponse = (error as any)?.response?.data;
  const maybeResponseData = (error as any)?.data;
  const apiResponse = maybeAxiosResponse ?? maybeResponseData ?? error;

  if (apiResponse && typeof apiResponse === 'object') {
    const extracted = extractResponseErrors(apiResponse as ApiResponse<any>);
    return extracted || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
