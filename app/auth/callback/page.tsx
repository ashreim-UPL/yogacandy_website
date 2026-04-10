'use client';

import { supabase } from '@/lib/supabase';
import { syncCurrentUserProfile } from '@/lib/profile';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (session?.user) {
        const params = new URLSearchParams(window.location.search);
        const role = params.get('role') === 'teacher' ? 'teacher' : params.get('role') === 'student' ? 'student' : undefined;
        await syncCurrentUserProfile(session.user, role ? { role } : undefined);
      }

      if (!mounted) return;
      const next = new URLSearchParams(window.location.search).get('next') ?? '/dashboard';
      window.location.href = next;
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center gap-1 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-gray-500 text-sm">Completing sign-in...</p>
      </div>
    </div>
  );
}
