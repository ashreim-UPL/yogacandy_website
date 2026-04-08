'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type SubmissionRow = {
  id: string;
  title: string;
  event_date: string;
  format: 'Online' | 'In person' | 'Hybrid';
  city: string;
  country: string;
  country_code: string;
  price: string | null;
  description: string;
  source_name: string;
  source_url: string | null;
  tags: string[];
  location_key: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_id: string | null;
};

type ProfileRow = {
  id: string;
  role: string;
  full_name: string | null;
  email: string | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminEventsPage() {
  const [sessionReady, setSessionReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [published, setPublished] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setActionError(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user ?? null;
    setSessionReady(true);

    if (!user) {
      setProfile(null);
      setIsAdmin(false);
      setSubmissions([]);
      setPublished([]);
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      setActionError(profileError.message);
      setLoading(false);
      return;
    }

    setProfile(profileData ?? null);
    setIsAdmin(profileData?.role === 'admin');

    if (profileData?.role !== 'admin') {
      setSubmissions([]);
      setPublished([]);
      setLoading(false);
      return;
    }

    const [pendingRes, liveRes] = await Promise.all([
      supabase
        .from('event_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
      supabase
        .from('event_listings')
        .select('*')
        .eq('status', 'active')
        .order('event_date', { ascending: true }),
    ]);

    if (pendingRes.error) {
      setActionError(pendingRes.error.message);
    } else {
      setSubmissions((pendingRes.data as SubmissionRow[]) ?? []);
    }

    if (liveRes.error) {
      setActionError(liveRes.error.message);
    } else {
      setPublished((liveRes.data as SubmissionRow[]) ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function approveSubmission(submission: SubmissionRow) {
    setActionError(null);
    setActionStatus(null);

    const eventRow = {
      title: submission.title,
      event_date: submission.event_date,
      format: submission.format,
      city: submission.city,
      country: submission.country,
      country_code: submission.country_code,
      price: submission.price,
      description: submission.description,
      source_name: submission.source_name,
      source_url: submission.source_url,
      tags: submission.tags,
      location_key: submission.location_key,
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from('event_listings').insert(eventRow);
    if (insertError) {
      setActionError(insertError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from('event_submissions')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', submission.id);

    if (updateError) {
      setActionError(updateError.message);
      return;
    }

    setActionStatus(`Approved ${submission.title}`);
    await loadData();
  }

  async function rejectSubmission(submission: SubmissionRow) {
    setActionError(null);
    setActionStatus(null);

    const { error } = await supabase
      .from('event_submissions')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', submission.id);

    if (error) {
      setActionError(error.message);
      return;
    }

    setActionStatus(`Rejected ${submission.title}`);
    await loadData();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <Link href="/events" className="text-blue-600 text-sm font-bold hover:underline underline-offset-4">
            ← Back to Events
          </Link>
          <h1 className="text-4xl font-extrabold mt-4">Event Moderation</h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            This queue lets an admin promote approved submissions into the curated event listings table. It is the review layer that keeps the same-location aggregation process clean.
          </p>
        </header>

        {!sessionReady || loading ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">Loading moderation queue...</div>
        ) : !profile ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-3">Sign in required</h2>
            <p className="text-gray-600 mb-6">Use an admin account to review event submissions.</p>
            <Link href="/auth/signup" className="inline-flex bg-black text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
              Sign in
            </Link>
          </div>
        ) : !isAdmin ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-3">Admin access only</h2>
            <p className="text-gray-600">
              Your account is signed in as <span className="font-medium">{profile.role}</span>. Assign the admin role in Supabase if you want to use this page.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Admin</div>
                <div className="font-bold text-lg">{profile.full_name ?? 'Unnamed admin'}</div>
                <div className="text-sm text-gray-500">{profile.email}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Pending</div>
                <div className="font-bold text-3xl">{submissions.length}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Published</div>
                <div className="font-bold text-3xl">{published.length}</div>
              </div>
            </div>

            {actionError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{actionError}</div>}
            {actionStatus && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{actionStatus}</div>}

            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Pending Submissions</h2>
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No pending submissions right now.</p>
                ) : (
                  submissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-100 rounded-2xl p-5">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                              {submission.format}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                              {submission.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg">{submission.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(submission.event_date)} · {submission.city}, {submission.country}</p>
                          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{submission.description}</p>
                          <div className="mt-3 text-xs text-gray-400">
                            Source: {submission.source_name}
                          </div>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                          <button
                            onClick={() => rejectSubmission(submission)}
                            className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => approveSubmission(submission)}
                            className="px-4 py-2 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Published Events</h2>
              <div className="space-y-3">
                {published.length === 0 ? (
                  <p className="text-gray-500 text-sm">No published events yet.</p>
                ) : (
                  published.map((event) => (
                    <div key={event.id} className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs text-gray-400">{event.city}, {event.country}</div>
                      </div>
                      <div className="text-xs text-gray-400">{formatDate(event.event_date)}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
