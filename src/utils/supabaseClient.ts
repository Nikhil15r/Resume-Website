import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase environment variables (supports both VITE_ and NEXT_PUBLIC_ prefixes,
// plus both legacy anon JWT and new sb_publishable_ keys)
const rawUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL
)?.trim();

const rawKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
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

function isValidPublishableKey(value: string | undefined): value is string {
  if (!value) return false;
  // Never allow secret/service_role keys in client-side bundles
  if (value.startsWith('sb_secret_') || value.includes('placeholder') || value.endsWith('...')) {
    return false;
  }
  return value.length >= 20;
}

export const hasSupabaseApiKey = isValidPublishableKey(rawKey);
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

// Instantiate client if both URL and publishable key are valid; otherwise null (handled gracefully by AuthContext)
export const supabase: SupabaseClient | null = createSafeSupabaseClient();
