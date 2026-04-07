'use client';

import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  useEffect(() => {
    supabase.auth.getSession().then(() => {
      const next = new URLSearchParams(window.location.search).get('next') ?? '/';
      window.location.href = next;
    });
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
