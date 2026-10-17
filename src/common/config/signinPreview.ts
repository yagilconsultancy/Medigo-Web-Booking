/**
 * Sign-in preview switch.
 *
 * The redesigned welcome and sign-in page is shown only while BOTH are true:
 *   - NEXT_PUBLIC_SIGNIN_PREVIEW is "on"
 *   - today is on or before NEXT_PUBLIC_SIGNIN_PREVIEW_UNTIL (YYYY-MM-DD,
 *     Toronto time, inclusive)
 *
 * Anything else (unset, "off", a missing or past end date, a typo) shows the
 * current login page. The end date makes the preview switch itself off even
 * if nobody redeploys.
 *
 * "test" is a quiet mode for checking the live site before the client sees
 * it: the preview appears only for someone who opens
 * /login?preview=signin (remembered for that browser tab), and everyone
 * else keeps the current page.
 */
export const isSigninPreviewOn = (now: Date = new Date()): boolean => {
  const flag = (process.env.NEXT_PUBLIC_SIGNIN_PREVIEW || '')
    .trim()
    .toLowerCase();
  if (flag !== 'on' && flag !== 'test') return false;

  const until = (process.env.NEXT_PUBLIC_SIGNIN_PREVIEW_UNTIL || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(until)) return false;

  // End of that day in Toronto. EDT is UTC-4 and EST is UTC-5; using -5 keeps
  // the preview on until midnight Toronto time in both seasons (at most one
  // extra hour in summer).
  const end = new Date(`${until}T23:59:59-05:00`);
  if (Number.isNaN(end.getTime())) return false;

  if (now.getTime() > end.getTime()) return false;
  if (flag === 'on') return true;

  // "test": only for someone who asked for it in this tab.
  if (typeof window === 'undefined') return false;
  try {
    const key = 'mg_signin_preview_test';
    if (
      new URLSearchParams(window.location.search).get('preview') === 'signin'
    ) {
      sessionStorage.setItem(key, '1');
    }
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
};

export const SOCIAL_CONFIG = {
  googleClientId: (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '').trim(),
  appleServiceId: (process.env.NEXT_PUBLIC_APPLE_SERVICE_ID || '').trim(),
  appleRedirectUri: (process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || '').trim(),
};
