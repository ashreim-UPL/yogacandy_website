export interface InstagramPostLink {
  id: string;
  label: string;
  url: string;
}

function normalizeUrl(value: string | undefined, fallback = "") {
  const trimmed = value?.trim();
  return trimmed && /^https?:\/\//i.test(trimmed) ? trimmed : fallback;
}

export function isInstagramPostUrl(url: string) {
  return /^https:\/\/(www\.)?instagram\.com\/(p|reel)\//i.test(url);
}

const instagramProfileUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL,
  "https://instagram.com/yogacandy",
);

const instagramPosts: InstagramPostLink[] = [
  {
    id: "post-1",
    label: "Latest Post",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_1),
  },
  {
    id: "post-2",
    label: "Community Reel",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_2),
  },
  {
    id: "post-3",
    label: "Studio Feature",
    url: normalizeUrl(process.env.NEXT_PUBLIC_INSTAGRAM_POST_URL_3),
  },
].filter((post) => Boolean(post.url));

export const publicSiteConfig = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  googleMapsLanguage: process.env.NEXT_PUBLIC_GOOGLE_MAPS_LANGUAGE?.trim() ?? "en-US",
  googleMapsRegion: process.env.NEXT_PUBLIC_GOOGLE_MAPS_REGION?.trim() ?? "US",
  instagramProfileUrl,
  instagramPosts,
};
