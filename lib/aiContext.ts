export type AIProviderPreference = 'auto' | 'on-device' | 'gemini' | 'openai';
export type AIResponseStyle = 'brief' | 'simple' | 'detailed';
export type AIRecommendationMode = 'deterministic' | 'hybrid' | 'ai';
export type AIContextScope = 'profile' | 'profile+location' | 'profile+location+site';
export type AICloudModelId = 'gemini-2.5-flash' | 'gemma-3-27b-it' | 'gemma-3n-e4b-it';

export interface AIUserSettings {
  providerPreference: AIProviderPreference;
  responseStyle: AIResponseStyle;
  recommendationMode: AIRecommendationMode;
  contextScope: AIContextScope;
  cloudModelId: AICloudModelId;
  primaryGoal: string;
  physicalConsideration: string;
  availabilityWindow: string;
}

export interface AIProfileSnapshot {
  fullName?: string | null;
  role?: string | null;
  level?: string | null;
  yogaGoals?: string[] | null;
  preferredStyles?: string[] | null;
  city?: string | null;
  country?: string | null;
  countryCode?: string | null;
  bio?: string | null;
}

export interface AIPageContext {
  pathname: string;
  siteSignals: string[];
}

export const AI_PROVIDER_OPTIONS: Array<{ value: AIProviderPreference; label: string; description: string }> = [
  { value: 'auto', label: 'Auto', description: 'Use on-device AI first, then cloud fallback.' },
  { value: 'on-device', label: 'On-device', description: 'Prefer Chrome built-in AI when available.' },
  { value: 'gemini', label: 'Gemini', description: 'Use the Gemini API when configured.' },
  { value: 'openai', label: 'OpenAI', description: 'Use the OpenAI API when configured.' },
];

export const AI_RESPONSE_STYLE_OPTIONS: Array<{ value: AIResponseStyle; label: string; description: string }> = [
  { value: 'brief', label: 'Brief', description: 'Short bullets only.' },
  { value: 'simple', label: 'Simple', description: 'Short bullets with a little context.' },
  { value: 'detailed', label: 'Detailed', description: 'Slightly fuller answers, still concise.' },
];

export const AI_RECOMMENDATION_MODE_OPTIONS: Array<{ value: AIRecommendationMode; label: string; description: string }> = [
  { value: 'deterministic', label: 'Deterministic', description: 'Use rules first, AI only for explanation.' },
  { value: 'hybrid', label: 'Hybrid', description: 'Blend rules with AI ranking.' },
  { value: 'ai', label: 'AI-first', description: 'Let the model rank within guardrails.' },
];

export const AI_CONTEXT_SCOPE_OPTIONS: Array<{ value: AIContextScope; label: string; description: string }> = [
  { value: 'profile', label: 'Profile only', description: 'Use saved profile fields only.' },
  { value: 'profile+location', label: 'Profile + location', description: 'Include the current location too.' },
  {
    value: 'profile+location+site',
    label: 'Profile + location + site',
    description: 'Also include the current site page and content signals.',
  },
];

export const AI_CLOUD_MODEL_OPTIONS: Array<{ value: AICloudModelId; label: string; description: string }> = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Balanced general-purpose cloud model.' },
  { value: 'gemma-3-27b-it', label: 'Gemma 3 27B IT', description: 'Open model for richer text generation.' },
  { value: 'gemma-3n-e4b-it', label: 'Gemma 3n E4B IT', description: 'Smaller open model for lighter usage.' },
];

export const AI_GOAL_OPTIONS = [
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'strength', label: 'Strength' },
  { value: 'stress', label: 'Stress reduction' },
  { value: 'spiritual', label: 'Spiritual growth' },
  { value: 'sleep', label: 'Better sleep' },
  { value: 'injury', label: 'Injury recovery' },
  { value: 'community', label: 'Community' },
  { value: 'weight', label: 'Weight management' },
];

export const AI_PHYSICAL_CONSIDERATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'back', label: 'Back / spine' },
  { value: 'knees', label: 'Knees' },
  { value: 'wrists', label: 'Wrists' },
  { value: 'joints', label: 'Joint pain' },
  { value: 'recovery', label: 'Recovering from injury' },
];

export const AI_AVAILABILITY_OPTIONS = [
  { value: '15-20 minutes', label: '15-20 minutes' },
  { value: '30 minutes', label: '30 minutes' },
  { value: '45 minutes', label: '45 minutes' },
  { value: '60 minutes', label: '60 minutes' },
  { value: '90+ minutes', label: '90+ minutes' },
];

export function defaultAIUserSettings(): AIUserSettings {
  return {
    providerPreference: 'auto',
    responseStyle: 'brief',
    recommendationMode: 'hybrid',
    contextScope: 'profile+location+site',
    cloudModelId: 'gemini-2.5-flash',
    primaryGoal: 'stress',
    physicalConsideration: 'none',
    availabilityWindow: '30 minutes',
  };
}

export function normalizeAIUserSettings(raw: unknown): AIUserSettings {
  const base = defaultAIUserSettings();
  if (!raw || typeof raw !== 'object') return base;

  const source = raw as Record<string, unknown>;
  const nested = source.ai_preferences && typeof source.ai_preferences === 'object'
    ? (source.ai_preferences as Record<string, unknown>)
    : null;

  const read = (keys: string[]) => {
    for (const key of keys) {
      const value = source[key] ?? nested?.[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return undefined;
  };

  const providerPreference = read(['ai_provider_preference']) as AIProviderPreference | undefined;
  const responseStyle = read(['ai_response_style']) as AIResponseStyle | undefined;
  const recommendationMode = read(['ai_recommendation_mode']) as AIRecommendationMode | undefined;
  const contextScope = read(['ai_context_scope']) as AIContextScope | undefined;
  const cloudModelId = read(['ai_cloud_model_id']) as AICloudModelId | undefined;
  const primaryGoal = read(['ai_primary_goal']) ?? base.primaryGoal;
  const physicalConsideration = read(['ai_physical_consideration']) ?? base.physicalConsideration;
  const availabilityWindow = read(['ai_availability_window']) ?? base.availabilityWindow;

  return {
    providerPreference: providerPreference ?? base.providerPreference,
    responseStyle: responseStyle ?? base.responseStyle,
    recommendationMode: recommendationMode ?? base.recommendationMode,
    contextScope: contextScope ?? base.contextScope,
    cloudModelId: cloudModelId ?? base.cloudModelId,
    primaryGoal,
    physicalConsideration,
    availabilityWindow,
  };
}

export function serializeAIUserSettings(settings: AIUserSettings) {
  return {
    ai_provider_preference: settings.providerPreference,
    ai_response_style: settings.responseStyle,
    ai_recommendation_mode: settings.recommendationMode,
    ai_context_scope: settings.contextScope,
    ai_cloud_model_id: settings.cloudModelId,
    ai_primary_goal: settings.primaryGoal,
    ai_physical_consideration: settings.physicalConsideration,
    ai_availability_window: settings.availabilityWindow,
  };
}

export function buildAIContextSummary(
  profile: AIProfileSnapshot | null,
  location: { city?: string | null; country?: string | null; countryCode?: string | null } | null,
  settings: AIUserSettings,
  page: AIPageContext,
) {
  const profileSummary = profile
    ? [
        profile.fullName ? `Name: ${profile.fullName}` : null,
        profile.role ? `Role: ${profile.role}` : null,
        profile.level ? `Level: ${profile.level}` : null,
        profile.yogaGoals?.length ? `Goals: ${profile.yogaGoals.join(', ')}` : null,
        profile.preferredStyles?.length ? `Styles: ${profile.preferredStyles.join(', ')}` : null,
      ].filter(Boolean).join(' | ')
    : 'No profile saved yet. Complete your profile to personalize recommendations.';

  const locationSummary = location?.city
    ? [location.city, location.country ?? location.countryCode ?? ''].filter(Boolean).join(', ')
    : 'Location not set. Allow location or enter your city and country.';

  return {
    profileSummary,
    locationSummary,
    settingsSummary: [
      `Provider: ${settings.providerPreference}`,
      `Cloud model: ${settings.cloudModelId}`,
      `Replies: ${settings.responseStyle}`,
      `Mode: ${settings.recommendationMode}`,
      `Scope: ${settings.contextScope}`,
      `Goal: ${settings.primaryGoal}`,
      `Window: ${settings.availabilityWindow}`,
      `Body: ${settings.physicalConsideration}`,
    ].join(' | '),
    pageSummary: page.pathname,
    siteSignals: page.siteSignals,
  };
}

export function buildGroundedChatPrompt(args: {
  profile: AIProfileSnapshot | null;
  location: { city?: string | null; country?: string | null; countryCode?: string | null } | null;
  settings: AIUserSettings;
  page: AIPageContext;
  modelId?: string;
}) {
  const { profile, location, settings, page, modelId } = args;
  const summary = buildAIContextSummary(profile, location, settings, page);
  const locationText = summary.locationSummary;
  const siteSignals = summary.siteSignals.length ? summary.siteSignals.join(', ') : 'none';
  const responseStyleRules = {
    brief: 'Use exactly 3 labeled lines: Quick take, Why it fits, Next step. Keep each line under 14 words.',
    simple: 'Use exactly 3 labeled lines: Quick take, Why it fits, Next step. Keep each line under 20 words.',
    detailed: 'Use exactly 3 labeled lines: Quick take, Why it fits, Next step. Keep each line under 28 words.',
  }[settings.responseStyle];

  return [
    'You are the YogaCandy assistant.',
    'Keep every answer grounded, brief, simple, and easy to scan.',
    'Use plain language only. No paragraphs, no markdown, no extra labels.',
    'Use this format exactly:',
    'Quick take: ...',
    'Why it fits: ...',
    'Next step: ...',
    responseStyleRules,
    'Never mention model names such as Gemma, Gemini, Claude, GPT, or similar.',
    'If asked about your model, answer only with the active provider label and keep it brief.',
    'Ground the answer in the provided profile, location, page, and site context.',
    'If the data is missing, say what is missing in one short bullet.',
    'Do not invent external yoga trends. Only reference the site context and the provided user data.',
    `Profile: ${summary.profileSummary}`,
    `Location: ${locationText}`,
    `Settings: ${summary.settingsSummary}`,
    modelId ? `Cloud model: ${modelId}` : null,
    `Page: ${summary.pageSummary}`,
    `Site signals: ${siteSignals}`,
  ].join('\n');
}

export function buildStyleRecommendationPrompt(args: {
  profile: AIProfileSnapshot | null;
  location: { city?: string | null; country?: string | null; countryCode?: string | null } | null;
  settings: AIUserSettings;
  page: AIPageContext;
  answers: Record<string, string>;
  allowedSlugs: string[];
}) {
  const { profile, location, settings, page, answers, allowedSlugs } = args;
  const summary = buildAIContextSummary(profile, location, settings, page);
  const answerText = Object.entries(answers)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ');

  return [
    'You are a yoga style ranking assistant.',
    'Return ONLY a JSON array of exactly 3 style slugs from the allowed list.',
    'No prose, no markdown, no code fences.',
    'Rank styles using the user profile, availability, location, and site context.',
    'Prefer deterministic recommendations when the profile and answers clearly point to a match.',
    'Do not mention model names or provider names in the response.',
    `Allowed styles: ${allowedSlugs.join(', ')}`,
    `Profile: ${summary.profileSummary}`,
    `Location: ${summary.locationSummary}`,
    `Settings: ${summary.settingsSummary}`,
    `Page: ${summary.pageSummary}`,
    `Answers: ${answerText}`,
    `Site signals: ${summary.siteSignals.join(', ') || 'none'}`,
  ].join('\n');
}
