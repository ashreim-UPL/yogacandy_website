import { supabase } from '@/lib/supabase';

type SessionUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

export type ProfileSnapshot = {
  full_name?: string | null;
  role?: string | null;
  level?: string | null;
  yoga_goals?: string[] | null;
  preferred_styles?: string[] | null;
  country_code?: string | null;
  city?: string | null;
  bio?: string | null;
  website_url?: string | null;
  instagram_handle?: string | null;
  marketing_consent?: boolean | null;
  onboarding_complete?: boolean | null;
};

function readString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readStringArray(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((item) => item.trim())
    : null;
}

function readBoolean(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === 'boolean' ? value : null;
}

export function normalizeProfileFromMetadata(metadata: Record<string, unknown> | null | undefined): ProfileSnapshot {
  const source = metadata ?? {};
  return {
    full_name: readString(source, 'full_name'),
    role: readString(source, 'role'),
    level: readString(source, 'level'),
    yoga_goals: readStringArray(source, 'yoga_goals'),
    preferred_styles: readStringArray(source, 'preferred_styles'),
    country_code: readString(source, 'country_code'),
    city: readString(source, 'city'),
    bio: readString(source, 'bio'),
    website_url: readString(source, 'website_url'),
    instagram_handle: readString(source, 'instagram_handle'),
    marketing_consent: readBoolean(source, 'marketing_consent'),
    onboarding_complete: readBoolean(source, 'onboarding_complete'),
  };
}

export async function syncCurrentUserProfile(
  user: SessionUser,
  overrides?: { role?: 'student' | 'teacher' },
) {
  const metadata = user.user_metadata ?? {};
  const fullName = typeof metadata.full_name === 'string' ? metadata.full_name : null;
  const role = overrides?.role ?? (metadata.role === 'teacher' ? 'teacher' : 'student');
  const city = typeof metadata.city === 'string' ? metadata.city : null;
  const country = typeof metadata.country === 'string'
    ? metadata.country
    : typeof metadata.country_code === 'string'
      ? metadata.country_code
      : null;
  const bio = typeof metadata.bio === 'string' ? metadata.bio : null;
  const website = typeof metadata.website_url === 'string' ? metadata.website_url : null;

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: fullName,
      role,
      bio,
      city,
      country,
      website,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  return { error };
}
