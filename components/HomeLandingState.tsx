"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function HomeLandingState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
        Loading your landing view...
      </div>
    );
  }

  if (user) {
    const firstName = user.user_metadata?.full_name?.split(" ")?.[0] ?? "there";

    return (
      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Welcome back</p>
            <h2 className="mt-1 text-lg font-bold text-black">Good to see you, {firstName}.</h2>
            <p className="text-sm text-gray-600">
              Your dashboard, profile, and recommendations are always available. Use the homepage to keep browsing.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard" className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
              Open dashboard
            </Link>
            <Link href="/profile" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-white">
              Edit profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:px-5 sm:py-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Guest view</p>
          <h2 className="mt-1 text-lg font-bold text-black">Browse the site, then sign in to personalize it.</h2>
          <p className="text-sm text-gray-600">
            Home stays open for everyone. Sign in when you want a dashboard, saved profile, and AI preferences.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/auth/signup?mode=login" className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
            Sign in
          </Link>
          <Link href="/dashboard" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
            Preview dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
