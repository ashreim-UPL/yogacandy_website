'use client';

import Link from 'next/link';
import { useLocation } from '@/app/context/LocationContext';
import { aggregationWorkflow, getEventsForLocation } from '@/app/data/events';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventsPage() {
  const { location, isLoading } = useLocation();
  const events = getEventsForLocation(location?.countryCode, 6);

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
              Teachers and organizers can share event information through the contact page for now. Later this can become a proper submission flow backed by a database and moderation queue.
            </p>
            <div className="flex flex-wrap gap-4">
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
