'use client';
export const dynamic = 'force-static';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const SSO_PROVIDERS = [
  {
    id: 'google',
    label: 'Continue with Google',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
    className: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    icon: (
      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    className: 'bg-[#1877F2] text-white hover:bg-[#166fe5]',
  },
];

function SignupForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'teacher' ? 'teacher' : 'student';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [isTeacher, setIsTeacher] = useState(defaultRole === 'teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [oauthAvailability, setOauthAvailability] = useState<{
    google?: boolean;
    apple?: boolean;
    facebook?: boolean;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = '/';
    });

    if (!supabaseUrl) return;

    fetch(`${supabaseUrl}/auth/v1/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setOauthAvailability({
          google: Boolean(data.external?.google?.enabled),
          apple: Boolean(data.external?.apple?.enabled),
          facebook: Boolean(data.external?.facebook?.enabled),
        });
      })
      .catch(() => {
        setOauthAvailability(null);
      });
  }, []);

  async function handleSSO(provider: 'google' | 'apple' | 'facebook') {
    const providerEnabled = oauthAvailability?.[provider];
    if (providerEnabled === false) {
      setError(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not enabled in Supabase yet. Turn it on in Authentication > Providers and add ${window.location.origin}/auth/callback to the redirect URLs.`,
      );
      return;
    }

    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${isTeacher ? 'teacher' : 'student'}`,
      },
    });
    if (authError) {
      if (authError.message.toLowerCase().includes('provider') && authError.message.toLowerCase().includes('not enabled')) {
        setError(
          `${provider.charAt(0).toUpperCase() + provider.slice(1)} is disabled in the Supabase project. Enable it in Authentication > Providers and keep ${window.location.origin}/auth/callback in the redirect list.`,
        );
      } else {
        setError(authError.message);
      }
      setLoading(false);
    }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'signup' && !gdprConsent) {
      setError('Please accept the privacy policy to continue.');
      return;
    }
    setLoading(true);
    setError(null);

    if (mode === 'signup') {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: isTeacher ? 'teacher' : 'student',
            gdpr_consent: true,
            gdpr_consent_at: new Date().toISOString(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) {
        setError(authError.message);
      } else {
        setSuccess('Check your inbox - we sent you a confirmation link.');
      }
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
      } else {
        window.location.href = '/';
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/yogacandy-banner.svg" alt="YogaCandy" className="h-8 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'signup' ? 'Join the YogaCandy community.' : 'Sign in to your YogaCandy account.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {(['signup', 'login'] as const).map((nextMode) => (
              <button
                key={nextMode}
                onClick={() => {
                  setMode(nextMode);
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === nextMode ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {nextMode === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            {SSO_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSSO(provider.id as 'google' | 'apple' | 'facebook')}
                disabled={loading || oauthAvailability?.[provider.id as 'google' | 'apple' | 'facebook'] === false}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${provider.className}`}
              >
                {provider.icon}
                {provider.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Google sign-in requires the provider to be enabled in Supabase. If it is not, the button will still show the exact setup problem instead of failing silently.
          </p>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    I am joining as
                  </label>
                  <div className="flex rounded-xl bg-gray-100 p-1">
                    {[{ label: 'Student', value: false }, { label: 'Teacher', value: true }].map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setIsTeacher(option.value)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                          isTeacher === option.value ? 'bg-white shadow-sm text-black' : 'text-gray-500'
                        }`}
                      >
                        {option.value ? '🧑‍🏫' : '🧘'} {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
              />
            </div>

            {mode === 'signup' && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-600 flex-shrink-0"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the <Link href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link> and consent to YogaCandy processing my data as described. I understand I can withdraw consent at any time. <span className="text-gray-400">(Required - GDPR Art. 7)</span>
                </span>
              </label>
            )}

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

            <button
              type="submit"
              disabled={loading || (mode === 'signup' && !gdprConsent)}
              className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <a href="/auth/reset-password" className="text-xs text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          By continuing, you agree to our <Link href="/privacy" className="hover:underline">Privacy Policy</Link>. YogaCandy is GDPR compliant - your data is never sold.
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
