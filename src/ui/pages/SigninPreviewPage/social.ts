import axios from 'axios';

export type SocialProvider = 'google' | 'apple';

export type SocialResult =
  | { kind: 'ok'; accessToken: string; refreshToken: string; message: string }
  | {
      kind: 'link';
      linkToken: string;
      provider: SocialProvider;
      message: string;
    }
  | { kind: 'error'; message: string };

const API = () =>
  (process.env.NEXT_PUBLIC_BASE_API_URL || '').replace(/\/$/, '');

const readError = (body: any, fallback: string) => {
  if (!body) return fallback;
  if (typeof body.message === 'string' && body.message) return body.message;
  if (typeof body.detail === 'string' && body.detail) return body.detail;
  return fallback;
};

const toResult = (status: number, body: any): SocialResult => {
  if (status >= 200 && status < 300 && body?.success && body?.data) {
    return {
      kind: 'ok',
      accessToken: body.data.access_token,
      refreshToken: body.data.refresh_token,
      message: body.message || 'Login successful',
    };
  }
  const details = body?.details || body?.error?.details || {};
  if (
    status === 409 &&
    details?.code === 'account_link_required' &&
    details?.link_token
  ) {
    return {
      kind: 'link',
      linkToken: details.link_token,
      provider: details.provider,
      message: readError(body, 'An account with this email already exists.'),
    };
  }
  if (status === 429) {
    return {
      kind: 'error',
      message:
        'Too many attempts from this device. Please wait a few minutes and try again.',
    };
  }
  return {
    kind: 'error',
    message: readError(body, 'We could not sign you in. Please try again.'),
  };
};

// Plain axios on purpose: the shared client retries 401s with a refresh
// token, which makes no sense before anyone is signed in.
const post = async (path: string, payload: Record<string, unknown>) => {
  try {
    const res = await axios.post(`${API()}${path}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
      validateStatus: () => true,
    });
    return toResult(res.status, res.data);
  } catch {
    return {
      kind: 'error',
      message:
        'We could not reach MediGo. Check your connection and try again.',
    } as SocialResult;
  }
};

export const socialLogin = (payload: {
  provider: SocialProvider;
  id_token: string;
  nonce?: string;
  first_name?: string;
  last_name?: string;
}) => post('/v1/auth/social/login', payload);

export const socialLink = (linkToken: string, password: string) =>
  post('/v1/auth/social/link', { link_token: linkToken, password });

export const makeNonce = () => {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};

const loaded: Record<string, Promise<void>> = {};
export const loadScript = (src: string) => {
  if (!loaded[src]) {
    loaded[src] = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => {
        delete loaded[src];
        reject(new Error(`Could not load ${src}`));
      };
      document.head.appendChild(s);
    });
  }
  return loaded[src];
};

export const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';
export const APPLE_SCRIPT =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
