'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface UserLocation {
  city: string;
  country: string;
  countryCode: string; // ISO 2-letter, e.g. "AE", "US"
  lat?: number;
  lng?: number;
  source: 'detected' | 'manual' | 'default';
}

interface LocationContextValue {
  location: UserLocation | null;
  isLoading: boolean;
  setLocation: (loc: UserLocation) => void;
  detectLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);
const STORAGE_KEY = 'yogacandy_location';

async function reverseGeocode(
  lat: number,
  lng: number,
  apiKey: string,
): Promise<{ city: string; country: string; countryCode: string } | null> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=locality|administrative_area_level_1|country&key=${apiKey}`,
    );
    const data = await res.json();
    if (data.status !== 'OK' || !data.results?.length) return null;

    let city = '';
    let country = '';
    let countryCode = '';

    for (const result of data.results) {
      for (const component of (result.address_components ?? [])) {
        if ((component.types.includes('locality') || component.types.includes('administrative_area_level_1')) && !city) {
          city = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
          countryCode = component.short_name;
        }
      }
      if (city && country) break;
    }

    return city && country ? { city, country, countryCode } : null;
  } catch {
    return null;
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const detectLocation = useCallback(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || typeof navigator === 'undefined' || !navigator.geolocation) return;

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude, apiKey);
        if (geo) {
          const loc: UserLocation = {
            ...geo,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            source: 'detected',
          };
          setLocationState(loc);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
        }
        setIsLoading(false);
      },
      () => setIsLoading(false),
      { timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLocationState(JSON.parse(saved));
        return;
      } catch {
        // corrupt data — ignore and detect fresh
      }
    }
    detectLocation();
  }, [detectLocation]);

  const setLocation = useCallback((loc: UserLocation) => {
    setLocationState(loc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  }, []);

  return (
    <LocationContext.Provider value={{ location, isLoading, setLocation, detectLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within a LocationProvider');
  return ctx;
}
