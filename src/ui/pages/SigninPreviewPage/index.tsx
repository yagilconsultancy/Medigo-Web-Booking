'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AccountType,
  setAuthToken,
  setRefreshToken,
  useAccountStore,
  useAuthApi,
} from '../../../common';
import { SOCIAL_CONFIG } from '../../../common/config/signinPreview';
import { MediGoLogo } from './MediGoLogo';
import {
  APPLE_SCRIPT,
  GOOGLE_SCRIPT,
  SocialProvider,
  SocialResult,
  loadScript,
  makeNonce,
  socialLink,
  socialLogin,
} from './social';
import s from './signin-preview.module.css';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap';

const cx = (...c: (string | false | undefined)[]) =>
  c.filter(Boolean).join(' ');

const useBrandFont = () => {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = FONT_HREF;
    document.head.appendChild(l);
  }, []);
};

/* ------------------------------------------------------------------ */
/* W0 welcome: the MediGo ambulance drives in, then the actions rise. */
/* ------------------------------------------------------------------ */
function Welcome({ onLogin }: { onLogin: () => void }) {
  const router = useRouter();
  const heights = [
    55, 77, 41, 91, 64, 50, 82, 43, 68, 95, 59, 45, 73, 86, 55, 39, 80, 64,
  ];
  return (
    <main className={s.stage}>
      <div className={s.glow} aria-hidden />
      <div className={s.skyline} aria-hidden>
        {heights.map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className={s.sign} aria-hidden>
        <div className={s.plate} />
        <div className={s.pole} />
      </div>
      <div className={s.road} aria-hidden>
        <div className={s.lane} />
      </div>
      <div className={s.car}>
        <MediGoLogo label="MediGo" />
      </div>
      <div className={s.copy}>
        <h1 className={cx(s.title, s.rise, s.d1)}>Welcome to MediGo</h1>
        <p className={cx(s.tag, s.rise, s.d2)}>
          Safe, accessible rides to your medical appointments.
        </p>
        <div className={cx(s.acts, s.rise, s.d3)}>
          <button
            type="button"
            className={cx(s.btn, s.primary)}
            onClick={onLogin}
          >
            Log in
          </button>
          <button
            type="button"
            className={s.btn}
            onClick={() => router.push('/sign-up')}
          >
            Create account
          </button>
        </div>
        <button
          type="button"
          className={cx(s.guestLink, s.rise, s.d4)}
          onClick={() => router.push('/guest/login')}
        >
          Book as a guest
        </button>
      </div>
      <div className={cx(s.foot, s.rise, s.d5)}>web.getmedigo.com</div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Apple mark (from Apple's Sign in with Apple guidelines).            */
/* ------------------------------------------------------------------ */
const AppleMark = () => (
  <svg viewBox="0 0 17 20" aria-hidden>
    <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.8-1-2.8-4.1zM11.6 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z" />
  </svg>
);

const PERKS: [string, string][] = [
  [
    'Book in minutes, on the web or the app',
    'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  ],
  [
    'Follow your driver live on the map',
    'M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  ],
  [
    'Share the trip with family in one tap',
    'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13',
  ],
  [
    'Chat with your driver and our support team',
    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  ],
];

/* ------------------------------------------------------------------ */
/* W1 sign in                                                          */
/* ------------------------------------------------------------------ */
function SignIn() {
  const router = useRouter();
  const { login } = useAuthApi();
  const { accountType, setAccountType } = useAccountStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState<null | 'email' | SocialProvider>(null);
  const [alert, setAlert] = useState('');
  const [link, setLink] = useState<{
    token: string;
    provider: SocialProvider;
  } | null>(null);
  const nonceRef = useRef('');
  const googleSlot = useRef<HTMLDivElement>(null);
  const individual = accountType !== 'facility';
  const { googleClientId, appleServiceId, appleRedirectUri } = SOCIAL_CONFIG;

  const finish = useCallback(
    (res: SocialResult, provider: SocialProvider) => {
      if (res.kind === 'ok') {
        setAuthToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        setAccountType('individual');
        toast.success(res.message || 'Login successful');
        router.push('/booking?account=individual');
        return;
      }
      setBusy(null);
      if (res.kind === 'link') {
        setLink({ token: res.linkToken, provider });
        return;
      }
      setAlert(res.message);
    },
    [router, setAccountType]
  );

  // Google: Google's own button (it handles the popup and returns an ID token).
  useEffect(() => {
    if (!individual || !googleClientId || !googleSlot.current) return;
    let cancelled = false;
    if (!nonceRef.current) nonceRef.current = makeNonce();
    loadScript(GOOGLE_SCRIPT)
      .then(() => {
        const g = (window as any).google;
        if (cancelled || !g?.accounts?.id || !googleSlot.current) return;
        g.accounts.id.initialize({
          client_id: googleClientId,
          nonce: nonceRef.current,
          ux_mode: 'popup',
          callback: async (resp: any) => {
            if (!resp?.credential) return;
            setAlert('');
            setBusy('google');
            finish(
              await socialLogin({
                provider: 'google',
                id_token: resp.credential,
                nonce: nonceRef.current,
              }),
              'google'
            );
          },
        });
        googleSlot.current.innerHTML = '';
        g.accounts.id.renderButton(googleSlot.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center',
          width: Math.min(400, googleSlot.current.offsetWidth || 400),
        });
      })
      .catch(() => {
        if (!cancelled)
          setAlert(
            'Google sign-in could not load. You can still log in with email.'
          );
      });
    return () => {
      cancelled = true;
    };
  }, [individual, googleClientId, finish]);

  const appleReady = individual && !!appleServiceId && !!appleRedirectUri;
  useEffect(() => {
    if (appleReady) loadScript(APPLE_SCRIPT).catch(() => undefined);
  }, [appleReady]);

  const onApple = async () => {
    setAlert('');
    try {
      await loadScript(APPLE_SCRIPT);
      const A = (window as any).AppleID;
      if (!nonceRef.current) nonceRef.current = makeNonce();
      A.auth.init({
        clientId: appleServiceId,
        scope: 'name email',
        redirectURI: appleRedirectUri,
        state: makeNonce(),
        nonce: nonceRef.current,
        usePopup: true,
      });
      setBusy('apple');
      const r = await A.auth.signIn();
      const idToken = r?.authorization?.id_token;
      if (!idToken) {
        setBusy(null);
        setAlert('Apple did not return a sign-in. Please try again.');
        return;
      }
      finish(
        await socialLogin({
          provider: 'apple',
          id_token: idToken,
          nonce: nonceRef.current,
          first_name: r?.user?.name?.firstName || undefined,
          last_name: r?.user?.name?.lastName || undefined,
        }),
        'apple'
      );
    } catch (e: any) {
      setBusy(null);
      const code = e?.error || e?.message || '';
      if (
        String(code).includes('popup_closed') ||
        String(code).includes('user_cancelled')
      )
        return;
      setAlert(
        'Sign in with Apple did not finish. Please try again or use email.'
      );
    }
  };

  const emailBad = touched && !/^\S+@\S+\.\S+$/.test(email);
  const pwBad = touched && !password;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setAlert('');
    if (!/^\S+@\S+\.\S+$/.test(email) || !password) return;
    setBusy('email');
    const ok = await login(
      { email: email.trim(), password },
      { redirectTo: `/booking?account=${accountType}`, accountType }
    );
    if (!ok) setBusy(null);
  };

  const pick = (t: AccountType) => {
    setAccountType(t);
    setAlert('');
  };

  return (
    <div className={s.split}>
      <aside className={s.aside}>
        <MediGoLogo className={s.logo} />
        <div className={s.asideBody}>
          <h2 className={s.asideTitle}>Always there when you need us</h2>
          <p className={s.asideText}>
            Book safe, accessible rides to medical appointments across Ontario.
          </p>
          <ul className={s.perks}>
            {PERKS.map(([t, d]) => (
              <li key={t}>
                <span className={s.perkIc}>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d={d} />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className={s.asideFoot}>
          One account works on the MediGo app and on web.getmedigo.com.
        </p>
      </aside>

      <main className={s.main}>
        <div className={s.panel}>
          <h1 className={s.h1}>Welcome back</h1>
          <p className={s.sub}>Log in to book and manage your rides.</p>

          <div className={s.seg} role="group" aria-label="Account type">
            <span
              className={cx(s.knob, !individual && s.knobRight)}
              aria-hidden
            />
            <button
              type="button"
              aria-pressed={individual}
              onClick={() => pick('individual')}
            >
              Individual
            </button>
            <button
              type="button"
              aria-pressed={!individual}
              onClick={() => pick('facility')}
            >
              Facility
            </button>
          </div>

          {individual && (appleReady || googleClientId) && (
            <>
              {appleReady && (
                <button
                  type="button"
                  className={s.appleBtn}
                  onClick={onApple}
                  disabled={!!busy}
                >
                  {busy === 'apple' ? (
                    <span className={s.spinner} />
                  ) : (
                    <AppleMark />
                  )}
                  Continue with Apple
                </button>
              )}
              {googleClientId && (
                <div
                  className={s.googleSlot}
                  ref={googleSlot}
                  aria-busy={busy === 'google'}
                />
              )}
              <div className={s.or}>or</div>
            </>
          )}

          {alert && (
            <div className={s.alert} role="alert">
              {alert}
            </div>
          )}

          <form className={s.form} onSubmit={onSubmit} noValidate>
            <label className={s.field}>
              <span className={s.label}>Email</span>
              <input
                className={cx(s.input, emailBad && s.inputBad)}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={emailBad || undefined}
              />
              {emailBad && (
                <span className={s.err}>Enter a valid email address</span>
              )}
            </label>
            <label className={s.field}>
              <span className={s.label}>Password</span>
              <span className={s.inputWrap}>
                <input
                  className={cx(s.input, pwBad && s.inputBad)}
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={pwBad || undefined}
                />
                <button
                  type="button"
                  className={s.show}
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </span>
              {pwBad && <span className={s.err}>Password is required</span>}
            </label>
            <div className={s.forgotRow}>
              <button
                type="button"
                className={s.link}
                onClick={() => router.push('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className={cx(s.btn, s.primary, s.full)}
              disabled={!!busy}
            >
              {busy === 'email' ? <span className={s.spinner} /> : 'Log in'}
            </button>
          </form>

          <p className={s.center}>
            New to MediGo?{' '}
            <button
              type="button"
              className={s.link}
              onClick={() => router.push('/sign-up')}
            >
              Create an account
            </button>
          </p>

          <div className={s.guestCard}>
            <b>Need just one ride?</b>
            <button
              type="button"
              className={s.link}
              style={{ justifySelf: 'start' }}
              onClick={() => router.push('/guest/login')}
            >
              Book as a guest without an account
            </button>
          </div>
        </div>
      </main>

      {link && (
        <LinkAccount
          provider={link.provider}
          token={link.token}
          onClose={() => setLink(null)}
          onDone={(res) => finish(res, link.provider)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* W5: the email already has a MediGo password account.               */
/* ------------------------------------------------------------------ */
function LinkAccount({
  provider,
  token,
  onClose,
  onDone,
}: {
  provider: SocialProvider;
  token: string;
  onClose: () => void;
  onDone: (r: SocialResult) => void;
}) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const name = provider === 'apple' ? 'Apple' : 'Google';

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw) {
      setErr('Enter your MediGo password.');
      return;
    }
    setBusy(true);
    setErr('');
    const res = await socialLink(token, pw);
    setBusy(false);
    if (res.kind === 'ok') {
      onDone(res);
      return;
    }
    setErr(
      res.kind === 'error' ? res.message : 'We could not link your account.'
    );
  };

  return (
    <div
      className={s.scrim}
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-title"
    >
      <form className={s.dialog} onSubmit={submit}>
        <h2 id="link-title">Link your {name} account</h2>
        <p>
          You already have a MediGo account with this email. Enter its password
          once to link {name}. After that, you can sign in with {name}.
        </p>
        <label className={s.field}>
          <span className={s.label}>MediGo password</span>
          <input
            ref={inputRef}
            className={cx(s.input, !!err && s.inputBad)}
            type="password"
            autoComplete="current-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          {err && <span className={s.err}>{err}</span>}
        </label>
        <div className={s.dialogActs}>
          <button type="button" className={s.btn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={cx(s.btn, s.primary)}
            disabled={busy}
          >
            {busy ? <span className={s.spinner} /> : 'Link and log in'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function SigninPreviewPage() {
  useBrandFont();
  // Everyone lands on the welcome screen first; "Log in" opens the sign-in
  // page. The browser Back button returns to the welcome screen.
  const [view, setView] = useState<'welcome' | 'login'>('welcome');

  useEffect(() => {
    const onPop = () => setView('welcome');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openLogin = () => {
    window.history.pushState({ mgStep: 'login' }, '', window.location.href);
    setView('login');
    window.scrollTo(0, 0);
  };

  return (
    <div className={s.root} style={{ ['--mg-font' as any]: "'Montserrat'" }}>
      {view === 'welcome' && <Welcome onLogin={openLogin} />}
      {view === 'login' && <SignIn />}
    </div>
  );
}
