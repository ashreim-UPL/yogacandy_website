'use client';

import Link from 'next/link';
import { useLocation } from '@/app/context/LocationContext';
import { aggregationWorkflow, getEventsForLocation } from '@/app/data/events';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventsPage() {
  const { location, isLoading } = useLocation();
  const events = getEventsForLocation(location?.countryCode, 6);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    eventDate: '',
    format: 'Online',
    city: '',
    country: '',
    countryCode: '',
    price: '',
    description: '',
    sourceName: '',
    sourceUrl: '',
    tags: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionUserId(data.session?.user.id ?? null);
    });
  }, []);

  function handleSubmissionChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setSubmissionForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  }

  async function handleSubmitEvent(e: React.FormEvent) {
    e.preventDefault();
    setSubmissionError(null);
    setSubmissionStatus(null);

    if (!sessionUserId) {
      setSubmissionError('Please create an account first so we can store the event under your profile.');
      return;
    }

    setSubmissionLoading(true);
    const locationKey = `${submissionForm.countryCode || submissionForm.country || 'global'}:${submissionForm.city || 'online'}`.toLowerCase();
    const { error } = await supabase.from('event_submissions').insert({
      user_id: sessionUserId,
      title: submissionForm.title,
      event_date: submissionForm.eventDate,
      format: submissionForm.format,
      city: submissionForm.city,
      country: submissionForm.country,
      country_code: submissionForm.countryCode || 'GL',
      price: submissionForm.price || null,
      description: submissionForm.description,
      source_name: submissionForm.sourceName || 'user submission',
      source_url: submissionForm.sourceUrl || null,
      tags: submissionForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      location_key: locationKey,
      status: 'pending',
    });

    if (error) {
      setSubmissionError(error.message);
    } else {
      setSubmissionStatus('Event submitted for review. We will use it in the location workflow after moderation.');
      setSubmissionForm({
        title: '',
        eventDate: '',
        format: 'Online',
        city: '',
        country: '',
        countryCode: '',
        price: '',
        description: '',
        sourceName: '',
        sourceUrl: '',
        tags: '',
      });
    }

    setSubmissionLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
            Location-Based Events
          </span>
          <h1 className="text-4xl font-extrabold mb-3">Yoga Events Near You</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We will aggregate online and local events for your region, dedupe them, and store the results so people in the same location get a better list next time.
          </p>
          <p className="text-sm text-gray-400 mt-3">
            {isLoading
              ? 'Detecting your location...'
              : location
                ? `Showing events for ${location.city}${location.country ? `, ${location.country}` : ''}`
                : 'Showing online and global events until location is available.'}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                  {event.format}
                </span>
                <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
              </div>
              <h2 className="font-bold text-xl mb-2 leading-snug">{event.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{event.description}</p>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <div>{event.city}, {event.country}</div>
                <div className="font-medium text-gray-900">{event.price}</div>
                <div className="text-xs text-gray-400">{event.source}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-black text-white rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-4">How the event pipeline should work</h2>
            <div className="space-y-4 text-white/80">
              {aggregationWorkflow.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-sm">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Get involved</h2>
            <p className="text-gray-600 mb-6">
              Teachers and organizers can submit events here. Logged-in users create a row in the event submissions table, which can later be reviewed and promoted into the location-based event listings table.
            </p>
            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="title"
                  value={submissionForm.title}
                  onChange={handleSubmissionChange}
                  required
                  placeholder="Event title"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                />
                <input
                  name="eventDate"
                  type="date"
                  value={submissionForm.eventDate}
                  onChange={handleSubmissionChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  name="format"
                  value={submissionForm.format}
                  onChange={handleSubmissionChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow bg-white"
                >
                  <option>Online</option>
                  <option>In person</option>
                  <option>Hybrid</option>
                </select>
                <input
                  name="price"
                  value={submissionForm.price}
                  onChange={handleSubmissionChange}
                  placeholder="Price or free"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  name="city"
                  value={submissionForm.city}
                  onChange={handleSubmissionChange}
                  required
                  placeholder="City"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                />
                <input
                  name="country"
                  value={submissionForm.country}
                  onChange={handleSubmissionChange}
                  required
                  placeholder="Country"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                />
                <input
                  name="countryCode"
                  value={submissionForm.countryCode}
                  onChange={handleSubmissionChange}
                  maxLength={2}
                  placeholder="ISO code"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                />
              </div>
              <textarea
                name="description"
                value={submissionForm.description}
                onChange={handleSubmissionChange}
                required
                rows={4}
                placeholder="Describe the event and why it matters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow resize-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="sourceName"
                  value={submissionForm.sourceName}
                  onChange={handleSubmissionChange}
                  placeholder="Source name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                />
                <input
                  name="sourceUrl"
                  value={submissionForm.sourceUrl}
                  onChange={handleSubmissionChange}
                  placeholder="Source URL"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
                />
              </div>
              <input
                name="tags"
                value={submissionForm.tags}
                onChange={handleSubmissionChange}
                placeholder="Tags, comma separated"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-shadow"
              />

              {submissionError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {submissionError}
                </div>
              )}
              {submissionStatus && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                  {submissionStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={submissionLoading}
                className="w-full bg-black text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {submissionLoading ? 'Submitting...' : 'Submit Event'}
              </button>
            </form>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link href="/contact" className="bg-black text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                Suggest an Event
              </Link>
              <Link href="/auth/signup" className="border border-gray-200 text-gray-800 px-5 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">
                Create Your Profile
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
