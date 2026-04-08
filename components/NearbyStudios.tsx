'use client';

import { useLocation } from '@/app/context/LocationContext';

interface Props {
  styleName?: string; // e.g. "Ashtanga" — used in the search query
}

export default function NearbyStudios({ styleName }: Props) {
  const { location } = useLocation();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) return null;

  // If we have coords, embed a Places search map; otherwise use city name
  const query = styleName
    ? `${styleName} yoga studio`
    : 'yoga studio';

  let mapSrc: string;
  if (location?.lat && location?.lng) {
    // Maps Embed Places search centred on user coords
    mapSrc = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(query)}&center=${location.lat},${location.lng}&zoom=13`;
  } else if (location?.city) {
    mapSrc = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(`${query} near ${location.city} ${location.country}`)}`;
  } else {
    return null;
  }

  const mapsUrl = location?.lat && location?.lng
    ? `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location.lat},${location.lng},13z`
    : `https://www.google.com/maps/search/${encodeURIComponent(`${query} near ${location?.city ?? ''}`)}`;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">
            {styleName ? `${styleName} Studios` : 'Yoga Studios'} Near You
          </h2>
          {location && (
            <p className="text-sm text-gray-500 mt-0.5">
              Showing results near {location.city}{location.country ? `, ${location.country}` : ''}
            </p>
          )}
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-600 hover:underline underline-offset-4 flex-shrink-0"
        >
          Open in Maps ↗
        </a>
      </div>

      <div className="rounded-2xl overflow-hidden border border-gray-100">
        <iframe
          title={`${query} near you`}
          src={mapSrc}
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Map powered by Google Maps · Results may vary by location
      </p>
    </div>
  );
}
