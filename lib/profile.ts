import { supabase } from '@/lib/supabase';

type SessionUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

export async function syncCurrentUserProfile(
  user: SessionUser,
  overrides?: { role?: 'student' | 'teacher' },
) {
  const metadata = user.user_metadata ?? {};
  const fullName = typeof metadata.full_name === 'string' ? metadata.full_name : null;
  const role = overrides?.role ?? (metadata.role === 'teacher' ? 'teacher' : 'student');
  const city = typeof metadata.city === 'string' ? metadata.city : null;
  const country = typeof metadata.country === 'string' ? metadata.country : null;

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: fullName,
      role,
      city,
      country,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  return { error };
}
