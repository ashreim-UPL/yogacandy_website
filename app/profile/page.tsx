'use client';
export const dynamic = 'force-static';

import { supabase } from '@/lib/supabase';
import {
  AI_AVAILABILITY_OPTIONS,
  AI_CONTEXT_SCOPE_OPTIONS,
  AI_GOAL_OPTIONS,
  AI_PHYSICAL_CONSIDERATION_OPTIONS,
  AI_PROVIDER_OPTIONS,
  AI_RECOMMENDATION_MODE_OPTIONS,
  AI_RESPONSE_STYLE_OPTIONS,
  buildAIContextSummary,
  defaultAIUserSettings,
  normalizeAIUserSettings,
  serializeAIUserSettings,
  type AIContextScope,
  type AIProviderPreference,
  type AIRecommendationMode,
  type AIResponseStyle,
} from '@/lib/aiContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'student' | 'teacher' | 'studio_owner';
type Level = 'beginner' | 'intermediate' | 'advanced' | 'teacher';

interface Profile {
  id: string;
  full_name: string;
  role: Role;
  level: Level;
  yoga_goals: string[];
  preferred_styles: string[];
  country_code: string;
  city: string;
  bio: string;
  website_url: string;
  instagram_handle: string;
  marketing_consent: boolean;
  onboarding_complete: boolean;
  ai_provider_preference: AIProviderPreference;
  ai_response_style: AIResponseStyle;
  ai_recommendation_mode: AIRecommendationMode;
  ai_context_scope: AIContextScope;
  ai_primary_goal: string;
  ai_physical_consideration: string;
  ai_availability_window: string;
}

const YOGA_GOALS = [
  { id: 'flexibility', label: 'Improve flexibility', icon: '🤸' },
  { id: 'strength', label: 'Build strength', icon: '💪' },
  { id: 'stress', label: 'Reduce stress', icon: '🧘' },
  { id: 'spiritual', label: 'Spiritual growth', icon: '🕊️' },
  { id: 'weight', label: 'Weight management', icon: '⚖️' },
  { id: 'sleep', label: 'Better sleep', icon: '💤' },
  { id: 'injury', label: 'Injury recovery', icon: '🩺' },
  { id: 'community', label: 'Community & connection', icon: '🤝' },
];

const STYLE_OPTIONS = [
  'Hatha', 'Vinyasa', 'Ashtanga', 'Yin Yoga', 'Restorative',
  'Power Yoga', 'Kundalini', 'Iyengar', 'Bikram / Hot Yoga',
  'Yoga Nidra', 'Aerial', 'AcroYoga',
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'basics' | 'practice' | 'ai' | 'privacy'>('basics');

  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '',
    role: 'student',
    level: 'beginner',
    yoga_goals: [],
    preferred_styles: [],
    country_code: '',
    city: '',
    bio: '',
    website_url: '',
    instagram_handle: '',
    marketing_consent: false,
    onboarding_complete: false,
    ...defaultAIUserSettings(),
  });
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/auth/signup'); return; }
      const u = data.session.user;
      setUserId(u.id);

      // Pre-fill from auth metadata
      const aiSettings = normalizeAIUserSettings(u.user_metadata);
      setProfile((p) => ({
        ...p,
        full_name: u.user_metadata?.full_name ?? '',
        role: u.user_metadata?.role ?? 'student',
        ...aiSettings,
      }));

      // Load existing profile row if it exists
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', u.id)
        .single();

      if (existing) {
        setProfile((p) => ({
          ...p,
          ...existing,
          ...aiSettings,
        }));
      }
      setLoading(false);
    });
  }, [router]);

  function toggle<T extends string>(field: 'yoga_goals' | 'preferred_styles', value: T) {
    setProfile((p) => {
      const current = (p[field] ?? []) as T[];
      return {
        ...p,
        [field]: current.includes(value)
          ? current.filter((x) => x !== value)
          : [...current, value],
      };
    });
  }

  async function handleSave(complete = false) {
    if (!userId) return;
    setSaving(true);
    setError(null);

    const payload = {
      ...profile,
      id: userId,
      onboarding_complete: complete || profile.onboarding_complete,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'id' });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          ...serializeAIUserSettings({
            providerPreference: profile.ai_provider_preference ?? defaultAIUserSettings().providerPreference,
            responseStyle: profile.ai_response_style ?? defaultAIUserSettings().responseStyle,
            recommendationMode: profile.ai_recommendation_mode ?? defaultAIUserSettings().recommendationMode,
            contextScope: profile.ai_context_scope ?? defaultAIUserSettings().contextScope,
            primaryGoal: profile.ai_primary_goal ?? defaultAIUserSettings().primaryGoal,
            physicalConsideration: profile.ai_physical_consideration ?? defaultAIUserSettings().physicalConsideration,
            availabilityWindow: profile.ai_availability_window ?? defaultAIUserSettings().availabilityWindow,
          }),
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        setSuccess(true);
        if (complete) setTimeout(() => router.push('/'), 1200);
      }
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-1">
          {[0,1,2].map((i) => (
            <div key={i} className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'basics', label: 'About You', icon: '👤' },
    { id: 'practice', label: 'Practice', icon: '🧘' },
    { id: 'ai', label: 'AI Context', icon: '🤖' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
  ] as const;

  const aiSummary = buildAIContextSummary(
    {
      fullName: profile.full_name ?? undefined,
      role: profile.role ?? undefined,
      level: profile.level ?? undefined,
      yogaGoals: profile.yoga_goals ?? [],
      preferredStyles: profile.preferred_styles ?? [],
      city: profile.city ?? undefined,
      country: '',
      countryCode: profile.country_code ?? undefined,
      bio: profile.bio ?? undefined,
    },
    {
      city: profile.city ?? undefined,
      country: profile.country_code ?? undefined,
      countryCode: profile.country_code ?? undefined,
    },
    {
      providerPreference: profile.ai_provider_preference ?? defaultAIUserSettings().providerPreference,
      responseStyle: profile.ai_response_style ?? defaultAIUserSettings().responseStyle,
      recommendationMode: profile.ai_recommendation_mode ?? defaultAIUserSettings().recommendationMode,
      contextScope: profile.ai_context_scope ?? defaultAIUserSettings().contextScope,
      primaryGoal: profile.ai_primary_goal ?? defaultAIUserSettings().primaryGoal,
      physicalConsideration: profile.ai_physical_consideration ?? defaultAIUserSettings().physicalConsideration,
      availabilityWindow: profile.ai_availability_window ?? defaultAIUserSettings().availabilityWindow,
    },
    {
      pathname: '/profile',
      siteSignals: ['Profile page', 'User settings'],
    },
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Your Profile</h1>
          <p className="text-gray-500 text-sm">Help us personalise your YogaCandy experience.</p>
        </div>

        {/* Section tabs */}
        <div className="flex rounded-2xl bg-gray-100 p-1 mb-8">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeSection === s.id ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          {/* ── BASICS ── */}
          {activeSection === 'basics' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  value={profile.full_name ?? ''}
                  onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">I am a</label>
                <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
                  {(['student', 'teacher', 'studio_owner'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, role: r }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                        profile.role === r ? 'bg-white shadow text-black' : 'text-gray-500'
                      }`}
                    >
                      {r === 'studio_owner' ? 'Studio' : r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['beginner', 'intermediate', 'advanced', 'teacher'] as Level[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, level: l }))}
                      className={`py-2.5 rounded-xl text-sm font-bold capitalize border transition-all ${
                        profile.level === l
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
                  <input
                    value={profile.city ?? ''}
                    onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Dubai"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Country Code</label>
                  <input
                    value={profile.country_code ?? ''}
                    onChange={(e) => setProfile((p) => ({ ...p, country_code: e.target.value.toUpperCase().slice(0,2) }))}
                    placeholder="AE"
                    maxLength={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bio (optional)</label>
                <textarea
                  value={profile.bio ?? ''}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  placeholder="A little about your yoga journey…"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm resize-none"
                />
              </div>

              {(profile.role === 'teacher' || profile.role === 'studio_owner') && (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Public Profile Links</p>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Website URL</label>
                    <input
                      value={profile.website_url ?? ''}
                      onChange={(e) => setProfile((p) => ({ ...p, website_url: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Instagram Handle</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                      <input
                        value={profile.instagram_handle ?? ''}
                        onChange={(e) => setProfile((p) => ({ ...p, instagram_handle: e.target.value.replace('@','') }))}
                        placeholder="yourhandle"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveSection('practice')}
                className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                Next: Practice Preferences →
              </button>
            </div>
          )}

          {/* ── PRACTICE ── */}
          {activeSection === 'practice' && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold mb-4">What are your yoga goals? <span className="text-gray-400 font-normal text-xs">(select all that apply)</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {YOGA_GOALS.map(({ id, label, icon }) => {
                    const selected = (profile.yoga_goals ?? []).includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggle('yoga_goals', id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                          selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs font-bold">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-4">Which styles interest you? <span className="text-gray-400 font-normal text-xs">(select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map((style) => {
                    const selected = (profile.preferred_styles ?? []).includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggle('preferred_styles', style)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                          selected ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setActiveSection('basics')} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
                <button onClick={() => setActiveSection('privacy')} className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                  Next: Privacy →
                </button>
              </div>
            </div>
          )}

          {/* ── AI ── */}
          {activeSection === 'ai' && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-700">
                <p className="font-bold mb-2">AI context dashboard</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  These fields control how the assistant responds and how recommendations are grounded.
                  The same context will be used across chat and style recommendations.
                </p>
                <div className="mt-4 grid gap-2 text-xs">
                  <div><span className="font-semibold">Profile:</span> {aiSummary.profileSummary}</div>
                  <div><span className="font-semibold">Location:</span> {aiSummary.locationSummary}</div>
                  <div><span className="font-semibold">Settings:</span> {aiSummary.settingsSummary}</div>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">AI provider</label>
                  <select
                    value={profile.ai_provider_preference ?? defaultAIUserSettings().providerPreference}
                    onChange={(e) => setProfile((p) => ({ ...p, ai_provider_preference: e.target.value as AIProviderPreference }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm bg-white"
                  >
                    {AI_PROVIDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} - {opt.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Response style</label>
                    <select
                      value={profile.ai_response_style ?? defaultAIUserSettings().responseStyle}
                      onChange={(e) => setProfile((p) => ({ ...p, ai_response_style: e.target.value as AIResponseStyle }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm bg-white"
                    >
                      {AI_RESPONSE_STYLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} - {opt.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Recommendation mode</label>
                    <select
                      value={profile.ai_recommendation_mode ?? defaultAIUserSettings().recommendationMode}
                      onChange={(e) => setProfile((p) => ({ ...p, ai_recommendation_mode: e.target.value as AIRecommendationMode }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm bg-white"
                    >
                      {AI_RECOMMENDATION_MODE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} - {opt.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Context scope</label>
                    <select
                      value={profile.ai_context_scope ?? defaultAIUserSettings().contextScope}
                      onChange={(e) => setProfile((p) => ({ ...p, ai_context_scope: e.target.value as AIContextScope }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm bg-white"
                    >
                      {AI_CONTEXT_SCOPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} - {opt.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary goal</label>
                    <select
                      value={profile.ai_primary_goal ?? defaultAIUserSettings().primaryGoal}
                      onChange={(e) => setProfile((p) => ({ ...p, ai_primary_goal: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm bg-white"
                    >
                      {AI_GOAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Availability window</label>
                    <select
                      value={profile.ai_availability_window ?? defaultAIUserSettings().availabilityWindow}
                      onChange={(e) => setProfile((p) => ({ ...p, ai_availability_window: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm bg-white"
                    >
                      {AI_AVAILABILITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Physical consideration</label>
                    <select
                      value={profile.ai_physical_consideration ?? defaultAIUserSettings().physicalConsideration}
                      onChange={(e) => setProfile((p) => ({ ...p, ai_physical_consideration: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 text-sm bg-white"
                    >
                      {AI_PHYSICAL_CONSIDERATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveSection('practice')}
                  className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveSection('privacy')}
                  className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                >
                  Next: Privacy →
                </button>
              </div>
            </div>
          )}

          {/* ── PRIVACY ── */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-800 leading-relaxed">
                <p className="font-bold mb-2">🔒 Your data, your control</p>
                <p>Your profile is stored securely in Supabase (EU region). We never sell your data. You can delete your account and all associated data at any time by emailing <a href="mailto:privacy@yogacandy.info" className="underline">privacy@yogacandy.info</a>.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.marketing_consent ?? false}
                    onChange={(e) => setProfile((p) => ({ ...p, marketing_consent: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded accent-blue-600 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold">Email updates & recommendations</p>
                    <p className="text-xs text-gray-500 mt-0.5">Receive personalised yoga tips, event alerts, and content matched to your goals and location. You can unsubscribe any time. <span className="text-gray-400">(Optional — GDPR Art. 7)</span></p>
                  </div>
                </label>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 text-xs text-gray-500 space-y-2">
                <p><strong>Data we store:</strong> name, role, level, goals, preferred styles, city, country, bio, optional links.</p>
                <p><strong>Legal basis:</strong> Contract (account service, Art. 6.1.b) + Consent (marketing, Art. 6.1.a).</p>
                <p><strong>Your rights:</strong> Access, correct, erase, restrict, or port your data. <a href="/privacy" className="text-blue-600 underline">Full privacy policy →</a></p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">Profile saved successfully!</div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setActiveSection('practice')} className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Profile ✓'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
