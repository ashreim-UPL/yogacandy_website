'use client';

import { useLocation } from '@/app/context/LocationContext';
import NearbyStudios from '@/components/NearbyStudios';
import type { YogaStyle } from '@/app/data/styles';

const popularityConfig = {
  high: { label: 'Very Popular', color: 'bg-green-500', width: 'w-full' },
  medium: { label: 'Popular', color: 'bg-yellow-400', width: 'w-2/3' },
  low: { label: 'Emerging', color: 'bg-gray-300', width: 'w-1/3' },
};

interface Props {
  style: YogaStyle;
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const offset = 127397;
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => c.charCodeAt(0) + offset));
}

/** Match user's country name or code against style's countryPopularity entries */
function findUserCountryPopularity(style: YogaStyle, countryCode: string, countryName: string) {
  const code = countryCode.toUpperCase();
  // Try matching by country name (case-insensitive, partial match)
  return style.countryPopularity.find((c) => {
    const name = c.country.toLowerCase();
    return (
      name === countryName.toLowerCase() ||
      name.includes(countryName.toLowerCase()) ||
      countryName.toLowerCase().includes(name) ||
      // Common aliases
      (code === 'US' && (name.includes('united states') || name === 'usa')) ||
      (code === 'GB' && (name.includes('united kingdom') || name === 'uk')) ||
      (code === 'AE' && (name.includes('uae') || name.includes('emirates')))
    );
  });
}

export default function RegionalInsight({ style }: Props) {
  const { location } = useLocation();

  if (!location) return <NearbyStudios styleName={style.name} />;

  const userEntry = location.countryCode
    ? findUserCountryPopularity(style, location.countryCode, location.country)
    : null;

  const flag = countryFlag(location.countryCode);

  return (
    <div className="space-y-8">
      {/* Popularity in user's region */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-1">Popularity Near You</h2>
        <p className="text-sm text-gray-500 mb-6">
          {flag} {location.city}{location.country ? `, ${location.country}` : ''}
        </p>

        {userEntry ? (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-6">
            <span className="text-3xl">{flag}</span>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">{userEntry.country}</span>
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                  {popularityConfig[userEntry.level].label}
                </span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${popularityConfig[userEntry.level].color} ${popularityConfig[userEntry.level].width}`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-6 text-sm text-gray-500">
            {style.name} is growing globally — data for your specific region is coming soon.
          </div>
        )}

        {/* Teacher training near region */}
        {(() => {
          const localTraining = style.teacherTraining.filter((tt) => {
            const loc = tt.location.toLowerCase();
            return (
              loc.includes(location.country.toLowerCase()) ||
              loc.includes(location.city.toLowerCase()) ||
              (location.countryCode === 'US' && loc.includes('usa')) ||
              (location.countryCode === 'GB' && (loc.includes('uk') || loc.includes('united kingdom')))
            );
          });
          const otherTraining = style.teacherTraining.filter((tt) => !localTraining.includes(tt));

          return (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-3">
                Teacher Training
              </h3>
              <div className="space-y-2">
                {localTraining.map((tt) => (
                  <div
                    key={tt.name}
                    className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100"
                  >
                    <span className="text-green-600 mt-0.5">🎓</span>
                    <div>
                      <div className="font-semibold text-sm">{tt.name}</div>
                      <div className="text-xs text-green-700 mt-0.5">{tt.location}</div>
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      Near you
                    </span>
                  </div>
                ))}
                {otherTraining.slice(0, localTraining.length > 0 ? 2 : 3).map((tt) => (
                  <div
                    key={tt.name}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <span className="text-blue-600 mt-0.5">🌍</span>
                    <div>
                      <div className="font-semibold text-sm">{tt.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{tt.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* Google Maps nearby studios */}
      <NearbyStudios styleName={style.name} />
    </div>
  );
}
