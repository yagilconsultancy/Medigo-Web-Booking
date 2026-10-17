'use client';

import { useEffect, useState } from 'react';
import { isSigninPreviewOn } from '../../../common/config/signinPreview';
import { LoginPage } from '../LoginPage';
import { SigninPreviewPage } from './index';

/**
 * Picks the login page to show. The redesigned preview appears only while the
 * switch is on and its end date has not passed (see signinPreview.ts);
 * otherwise this is exactly the current login page.
 *
 * The choice is made in the browser so the end date is checked on every
 * visit, not once at build time.
 */
export function LoginGate() {
  const [preview, setPreview] = useState<boolean | null>(null);

  useEffect(() => {
    setPreview(isSigninPreviewOn());
  }, []);

  if (preview === null) return null;
  return preview ? <SigninPreviewPage /> : <LoginPage />;
}
