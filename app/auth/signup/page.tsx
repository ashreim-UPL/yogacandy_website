'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Providers configured in your Supabase dashboard
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
    id: 'apple',
    label: 'Continue with Apple',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.79.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    className: 'bg-black text-white hover:bg-gray-900',
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

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [isTeacher, setIsTeacher] = useState(defaultRole === 'teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = '/';
    });
  }, []);

  async function handleSSO(provider: 'google' | 'apple' | 'facebook') {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { role: isTeacher ? 'teacher' : 'student' },
      },
    });
    if (error) { setError(error.message); setLoading(false); }
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
      const { error } = await supabase.auth.signUp({
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
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Check your inbox — we sent you a confirmation link.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = '/';
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/">
            <img src="/yogacandy-banner.svg" alt="YogaCandy" className="h-8 mx-auto mb-4" />
          </a>
          <h1 className="text-2xl font-bold">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'signup'
              ? 'Join the YogaCandy community.'
              : 'Sign in to your YogaCandy account.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {(['signup', 'login'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === m ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            ))}
          </div>

          {/* SSO providers */}
          <div className="space-y-3 mb-6">
            {SSO_PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSSO(p.id as 'google' | 'apple' | 'facebook')}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${p.className}`}
              >
                {p.icon}
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* Email form */}
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

                {/* Teacher / Student toggle */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    I am joining as
                  </label>
                  <div className="flex rounded-xl bg-gray-100 p-1">
                    {[{ label: 'Student', value: false }, { label: 'Teacher', value: true }].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setIsTeacher(opt.value)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                          isTeacher === opt.value ? 'bg-white shadow-sm text-black' : 'text-gray-500'
                        }`}
                      >
                        {opt.value ? '🧑‍🏫' : '🧘'} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
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
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
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

            {/* GDPR consent — signup only */}
            {mode === 'signup' && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-600 flex-shrink-0"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                    Privacy Policy
                  </a>{' '}
                  and consent to YogaCandy processing my data as described. I understand I can withdraw consent at any time.{' '}
                  <span className="text-gray-400">(Required — GDPR Art. 7)</span>
                </span>
              </label>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode === 'signup' && !gdprConsent)}
              className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Log In'}
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
          By continuing, you agree to our{' '}
          <a href="/privacy" className="hover:underline">Privacy Policy</a>. YogaCandy is GDPR compliant —
          your data is never sold.
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
