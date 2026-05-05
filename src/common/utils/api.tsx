import { ReactNode } from 'react';
import { ApiResponse } from '../types';

export const extractResponseErrors = (
  apiResponse: ApiResponse<any>
): ReactNode => {
  if (apiResponse.success) {
    return null;
  }
  // @ts-ignore
  if (!apiResponse.error) {
    return 'An error occurred';
  }
  // @ts-ignore
  const errors = Array.isArray(apiResponse.error)
    ? // @ts-ignore
      apiResponse.error
    : // @ts-ignore
      [apiResponse.error];
  if (errors.length === 1) {
    return errors[0];
  }

  const errorNodes: ReactNode[] = errors.map((error, index) => (
    <li key={index}>{error}</li>
  ));

  return <ul>{errorNodes}</ul>;
};
