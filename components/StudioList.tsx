"use client";

import { useEffect, useState } from "react";
import { publicSiteConfig } from "@/app/config/public";
import type { TrainingCenter } from "@/app/data/styles";

type StudioSource = "google" | "curated";

interface StudioListItem {
  location: string;
  mapsUrl: string;
  name: string;
  source: StudioSource;
}

interface StudioListProps {
  fallbackCenters: TrainingCenter[];
  styleName: string;
}

interface GooglePlacesLibrary {
  Place: {
    searchByText: (request: Record<string, unknown>) => Promise<{
      places?: GooglePlaceSearchResult[];
    }>;
  };
}

interface GoogleMapsBootstrapNamespace {
  __ib__?: () => void;
  importLibrary?: (libraryName: string) => Promise<unknown>;
}

interface GooglePlaceSearchResult {
  displayName?: string;
  formattedAddress?: string;
  googleMapsURI?: string;
}

declare global {
  interface Window {
    google?: {
      maps?: GoogleMapsBootstrapNamespace;
    };
  }
}

function buildFallbackMapsUrl(center: TrainingCenter) {
  const query = encodeURIComponent(`${center.name}, ${center.location}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function mapCuratedCenters(centers: TrainingCenter[]): StudioListItem[] {
  return centers.map((center) => ({
    location: center.location,
    mapsUrl: buildFallbackMapsUrl(center),
    name: center.name,
    source: "curated",
  }));
}

function installGoogleMapsLoader(apiKey: string) {
  if (typeof window === "undefined" || window.google?.maps?.importLibrary) {
    return;
  }

  ((config: { key: string; v: string }) => {
    let scriptPromise: Promise<void> | undefined;
    const googleNamespace = (window.google ??= {});
    const mapsNamespace = (googleNamespace.maps ??= {});
    const requestedLibraries = new Set<string>();
    const params = new URLSearchParams();

    const loadScript = () =>
      scriptPromise ||
      (scriptPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");

        params.set("libraries", [...requestedLibraries].join(","));
        Object.entries(config).forEach(([key, value]) => {
          params.set(key.replace(/[A-Z]/g, (match) => `_${match[0].toLowerCase()}`), value);
        });
        params.set("callback", "google.maps.__ib__");

        script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
        script.async = true;
        script.onerror = () => reject(new Error("Google Maps JavaScript API failed to load."));
        mapsNamespace.__ib__ = resolve;
        document.head.append(script);
      }));

    if (!mapsNamespace.importLibrary) {
      mapsNamespace.importLibrary = (libraryName: string) => {
        requestedLibraries.add(libraryName);
        return loadScript().then(() => mapsNamespace.importLibrary!(libraryName));
      };
    }
  })({
    key: apiKey,
    v: "weekly",
  });
}

async function getLocationBias() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return undefined;
  }

  return new Promise<{ center: { lat: number; lng: number }; radius: number } | undefined>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          radius: Math.max(position.coords.accuracy, 5000),
        });
      },
      () => resolve(undefined),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 5000 },
    );
  });
}

export default function StudioList({ fallbackCenters, styleName }: StudioListProps) {
  const [status, setStatus] = useState<"fallback" | "live" | "loading" | "unconfigured">(
    publicSiteConfig.googleMapsApiKey ? "loading" : "unconfigured",
  );
  const [studios, setStudios] = useState<StudioListItem[]>(() => mapCuratedCenters(fallbackCenters));

  useEffect(() => {
    let isCancelled = false;

    async function loadStudios() {
      if (!publicSiteConfig.googleMapsApiKey) {
        setStatus("unconfigured");
        setStudios(mapCuratedCenters(fallbackCenters));
        return;
      }

      setStatus("loading");

      try {
        installGoogleMapsLoader(publicSiteConfig.googleMapsApiKey);

        const locationBias = await getLocationBias();
        const { Place } = (await window.google!.maps!.importLibrary!("places")) as GooglePlacesLibrary;
        const response = await Place.searchByText({
          fields: ["displayName", "formattedAddress", "googleMapsURI"],
          language: publicSiteConfig.googleMapsLanguage,
          maxResultCount: 6,
          region: publicSiteConfig.googleMapsRegion,
          textQuery: `${styleName} yoga studios`,
          ...(locationBias ? { locationBias } : {}),
        });

        const places = Array.isArray(response?.places) ? response.places : [];
        const nextStudios = places
          .filter((place) => place.displayName && place.formattedAddress)
          .map((place) => {
            const displayName = place.displayName ?? "Yoga studio";
            const formattedAddress = place.formattedAddress ?? "Address unavailable";

            return {
              location: formattedAddress,
            mapsUrl:
              (place.googleMapsURI as string | undefined) ??
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayName)}`,
              name: displayName,
              source: "google" as const,
            };
          });

        if (!isCancelled && nextStudios.length > 0) {
          setStudios(nextStudios);
          setStatus("live");
          return;
        }
      } catch {
        // Falls back to curated entries when Google Places is unavailable.
      }

      if (!isCancelled) {
        setStudios(mapCuratedCenters(fallbackCenters));
        setStatus("fallback");
      }
    }

    void loadStudios();

    return () => {
      isCancelled = true;
    };
  }, [fallbackCenters, styleName]);

  return (
    <div>
      <div className="space-y-4">
        {studios.map((studio) => (
          <a
            key={`${studio.source}-${studio.name}-${studio.location}`}
            href={studio.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <span className="text-blue-600 mt-0.5">📍</span>
            <div>
              <div className="font-semibold text-sm">{studio.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{studio.location}</div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        {status === "loading" && "Loading live studios from Google Places..."}
        {status === "live" && "Live results from Google Places. Studio links open in Google Maps."}
        {status === "fallback" &&
          "Google Places was unavailable, so curated studio recommendations are shown instead."}
        {status === "unconfigured" &&
          "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable live Google Places results. Curated studio recommendations are shown for now."}
      </p>
    </div>
  );
}
