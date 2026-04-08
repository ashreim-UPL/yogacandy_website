'use client';

import { useRef, useState } from 'react';
import { useLocation, type UserLocation } from '@/app/context/LocationContext';

// Flag emoji by ISO-3166-1 alpha-2 code
function countryFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const offset = 127397;
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => c.charCodeAt(0) + offset));
}

export default function LocationBanner() {
  const { location, isLoading, setLocation, detectLocation } = useLocation();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function openEdit() {
    setInput(location ? `${location.city}, ${location.country}` : '');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const city = parts[0];
    const country = parts.slice(1).join(', ') || '';
    const loc: UserLocation = { city, country, countryCode: '', source: 'manual' };
    setLocation(loc);
    setEditing(false);
  }

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-gray-400 animate-pulse">
        <span className="w-3 h-3 rounded-full bg-blue-300 inline-block" />
        Detecting your location…
      </div>
    );
  }

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="inline-flex items-center gap-2 flex-wrap">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="City, Country  (e.g. Dubai, UAE)"
          className="text-sm border border-gray-300 rounded-full px-4 py-1.5 focus:outline-none focus:border-blue-400 w-72 max-w-full"
        />
        <button type="submit" className="text-sm font-bold text-blue-600 hover:underline">
          Set
        </button>
        <button
          type="button"
          onClick={() => {
            detectLocation();
            setEditing(false);
          }}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Auto-detect
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </form>
    );
  }

  if (!location) {
    return (
      <button
        onClick={openEdit}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors border border-dashed border-gray-300 rounded-full px-4 py-1.5"
      >
        <span>📍</span> Set location for personalised results
      </button>
    );
  }

  const flag = countryFlag(location.countryCode);
  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-sm font-medium text-blue-800">
        <span>{flag}</span>
        {location.city}{location.country ? `, ${location.country}` : ''}
        {location.source === 'detected' && (
          <span className="text-[10px] font-normal text-blue-400 uppercase tracking-wider">detected</span>
        )}
      </span>
      <button onClick={openEdit} className="text-xs text-blue-600 hover:underline font-medium">
        Change
      </button>
    </div>
  );
}
