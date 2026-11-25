import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase environment variables (supports both legacy anon JWT and new sb_publishable_ keys)
const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const rawKey = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
)?.trim();

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  if (
    value === 'https://your-project.supabase.co' ||
    value.includes('your-project') ||
    value.includes('placeholder')
  ) {
    return false;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function isValidApiKey(value: string | undefined): value is string {
  if (!value) return false;
  if (value.includes('placeholder') || value.endsWith('...')) {
    return false;
  }
  return value.length >= 20;
}

export const hasSupabaseApiKey = isValidApiKey(rawKey);
export const hasSupabaseUrl = isValidHttpUrl(rawUrl);
export const isSupabaseConfigured = hasSupabaseUrl && hasSupabaseApiKey;

function createSafeSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !rawUrl || !rawKey) return null;
  try {
    return createClient(rawUrl, rawKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Instantiate client if both URL and API key are valid; otherwise null (handled gracefully by AuthContext)
export const supabase: SupabaseClient | null = createSafeSupabaseClient();
