'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/signup`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('Password reset email sent. Check your inbox and follow the link to set a new password.');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/yogacandy-banner.svg" alt="YogaCandy" className="h-8 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-gray-500 text-sm mt-1">We will send a secure reset link to your email address.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
              placeholder="you@example.com"
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          If you do not get the email, contact <a href="mailto:admin@yogacandy.store" className="text-blue-600 hover:underline">admin@yogacandy.store</a>.
        </div>
      </div>
    </div>
  );
}
