import { destroyCookie } from 'nookies';
import { statusMapping } from '../data';
import Cookies from 'js-cookie';

interface ArrayType {
  text: string;
}

/**
 * Builds a URL with query parameters.
 *
 * @param route - The base route URL.
 * @param params - An object with query parameters. If a parameter is an array, each value will be added as its own query parameter.
 * @returns The URL with encoded query parameters.
 */
export const buildUrlWithQueryParams = (
  route: string,
  params: Record<string, string | number | Array<string | number> | undefined>
): string => {
  const queryParts: string[] = [];

  for (const key in params) {
    if (!Object.prototype.hasOwnProperty.call(params, key)) continue;

    const value = params[key];
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      value.forEach((val) => {
        queryParts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`
        );
      });
    } else {
      queryParts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      );
    }
  }

  if (queryParts.length > 0) {
    return `${route}?${queryParts.join('&')}`;
  }

  return route;
};

/**
 * Resolves an object with query parameters to an object with only defined values.
 *
 * @param payload - An object with query parameters.
 * @returns An object with only defined values.
 */
export const resolveBuildQueryParamsPayload = (
  payload: Record<string, string | number | Array<string | number> | undefined>
) => {
  const result: typeof payload = {};

  for (const key in payload) {
    const value = payload[key];

    if (value) {
      if (Array.isArray(value)) {
        result[key] = value.length ? value : undefined;
      } else {
        result[key] = value;
      }
    } else {
      result[key] = undefined;
    }
  }

  return result;
};

/**
 * Converts a pixel value to rem
 */
export const pxToRem = (px: number): string => {
  return `${px / 16}rem`;
};

export const handleLogout = () => {
  Cookies.remove('medi_auth');
  Cookies.remove('medi_refresh');
  window.location.href = `/login`;
};

export function toDate(datePart: string, timePart: string): Date {
  const parts = datePart.replace(/,/g, '').trim().split(/\s+/);
  if (parts.length !== 3) throw new Error(`Invalid date: ${datePart}`);
  const [dayStr, monthRaw, yearStr] = parts as [string, string, string];

  const monthIdx = 'janfebmaraprmayjunjulaugsepoctnovdec'.indexOf(
    monthRaw.slice(0, 3).toLowerCase()
  );
  if (monthIdx < 0) throw new Error(`Invalid month: ${monthRaw}`);
  const month = monthIdx / 3 + 1;

  const timeRe = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i;
  const match = timePart.trim().match(timeRe);
  if (!match) throw new Error(`Invalid time: ${timePart}`);

  const [, hStr, mStr, ampmRaw] = match;
  let hours = Number(hStr) % 12;
  // @ts-ignore
  if (ampmRaw.toLowerCase() === 'pm') hours += 12;

  const yyyy = yearStr;
  const mmDate = String(month).padStart(2, '0');
  const dd = dayStr.padStart(2, '0');
  const hh = String(hours).padStart(2, '0');
  const mmTime = mStr;

  const isoLocal = `${yyyy}-${mmDate}-${dd}T${hh}:${mmTime}:00`;
  return new Date(isoLocal);
}

export const mapEquipmentToArrayType = (equipment: string[]): ArrayType[] => {
  if (!equipment || equipment.length === 0) return [];
  return equipment.map((item) => ({
    text: item
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  }));
};

// Utility function to format strings for UI display
export const formatForDisplay = (str: string): string => {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function kmToMiles(km: number): number {
  return Number((km * 0.621371).toFixed(2));
}

export function formatTotalNumber(num: number | undefined): string {
  if (num === undefined) return '0.00';
  return num.toLocaleString(
    'en-US'
    //   {
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 2,
    // }
  );
}

export const getTodayDate = (date: Date = new Date()) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export function secondsToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} hr`);
  }
  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes} min`);
  }

  return parts.join(' ') || '0 min';
}

export function deepEqual(a: any, b: any) {
  // If values are strictly equal, no further comparison needed
  if (a === b) return true;

  // Handle null or undefined cases
  if (a == null || b == null) return a === b;

  // Compare arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Compare objects (but not arrays)
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  // If types differ or values aren't equal, return false
  return false;
}

export function checkForChanges(obj1: any, obj2: any) {
  if (!deepEqual(obj1, obj2)) {
    console.log('Change detected!');
    return true;
  }
  return false;
}

export async function getFormattedAddress(address: string, apiKey: string) {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' || !data.results.length) {
    throw new Error('Address not found');
  }

  const result = data.results[0];
  const components = result.address_components;

  const getComponent = (type: string) =>
    components.find((c: { types: string | string[] }) => c.types.includes(type))
      ?.long_name || '';

  const formattedAddress = {
    streetAddress:
      `${getComponent('street_number')} ${getComponent('route')}`.trim(),
    city: getComponent('locality'),
    state: getComponent('administrative_area_level_1'),
    country: getComponent('country'),
    postalCode: getComponent('postal_code'),
  };

  const coordinates = {
    lat: result.geometry.location.lat,
    long: result.geometry.location.lng,
  };

  return {
    address: result.formatted_address,
    formattedAddress,
    coordinates,
  };
}

export function filterUniqueByNames(validNames: any, response: any) {
  const seen = new Set();

  return response.filter((item: any) => {
    if (!validNames.includes(item.name)) return false;
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

export function timeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return past.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const setAuthToken = (token: string) => {
  Cookies.set('medi_auth', token, {
    expires: 7, // days
    secure: process.env.NODE_ENV === 'production', // only sent over HTTPS in prod
    sameSite: 'strict',
  });
};

export const setRefreshToken = (token: string) => {
  Cookies.set('medi_refresh', token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getAuthToken = () => {
  const cookieToken = Cookies.get('medi_auth');
  if (cookieToken) {
    return cookieToken;
  }

  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('access_token') ?? undefined;
  }

  return undefined;
};

export const getRefreshToken = () => {
  return Cookies.get('medi_refresh');
};

export const removeAuthToken = () => {
  Cookies.remove('medi_auth');
};

export const removeRefreshToken = () => {
  Cookies.remove('medi_refresh');
};

export const toSnakeCase = (value: string): string => {
  return value.trim().toLowerCase().replace(/\s+/g, '_');
};
