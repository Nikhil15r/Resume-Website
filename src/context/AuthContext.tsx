import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, hasSupabaseUrl, hasSupabaseApiKey } from '../utils/supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider: 'email' | 'google';
  createdAt?: string;
}

export type AuthModalView = 'signin' | 'signup' | 'magic_link' | 'forgot_password' | 'reset_password';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  hasUrl: boolean;
  hasApiKey: boolean;
  isAuthModalOpen: boolean;
  authModalView: AuthModalView;
  externalError: string | null;
  clearExternalError: () => void;
  openAuthModal: (view?: AuthModalView, errorMessage?: string) => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: AuthModalView) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; unconfirmedEmail?: boolean }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string; error?: string; needsConfirmation?: boolean }>;
  signInWithMagicLink: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY_DEMO_USER = 'atelier_auth_demo_user';
const STORAGE_KEY_DEMO_ACCOUNTS = 'atelier_auth_demo_accounts';

const AuthContext = createContext<AuthContextType | null>(null);

async function hashDemoPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return password;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('signin');
  const [externalError, setExternalError] = useState<string | null>(null);

  const openAuthModal = useCallback((view: AuthModalView = 'signin', errorMessage?: string) => {
    setAuthModalView(view);
    if (errorMessage) {
      setExternalError(errorMessage);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setExternalError(null);
  }, []);

  const clearExternalError = useCallback(() => {
    setExternalError(null);
  }, []);

  // Helper to map Supabase User to AuthUser
  const mapSupabaseUser = (sbUser: any): AuthUser => {
    const meta = sbUser.user_metadata || {};
    const identities = sbUser.identities || [];
    const isGoogle =
      sbUser.app_metadata?.provider === 'google' ||
      identities.some((id: any) => id?.provider === 'google');

    return {
      id: sbUser.id,
      email: sbUser.email || '',
      fullName: meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'User',
      avatarUrl: meta.avatar_url || meta.picture || undefined,
      provider: isGoogle ? 'google' : 'email',
      createdAt: sbUser.created_at
    };
  };

  // Initialize Auth state
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      let mounted = true;

      // 1. Fetch current session from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      // 2. Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(mapSupabaseUser(session.user));
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'PASSWORD_RECOVERY') {
          // When user arrives via recovery link in email, open reset password modal
          if (session?.user) {
            setUser(mapSupabaseUser(session.user));
          }
          setLoading(false);
          openAuthModal('reset_password');
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      // Demo / Local development mode fallback when Supabase URL/key are not yet both set
      try {
        const stored = localStorage.getItem(STORAGE_KEY_DEMO_USER);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Error reading demo user:', e);
      }
      setLoading(false);
    }
  }, [openAuthModal]);

  // Sign In with Email & Password
  const signInWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) {
          const isUnconfirmed = error.message.toLowerCase().includes('email not confirmed');
          return {
            success: false,
            error: error.message,
            unconfirmedEmail: isUnconfirmed
          };
        }
        if (data.user) {
          setUser(mapSupabaseUser(data.user));
          closeAuthModal();
          return { success: true };
        }
        return { success: false, error: 'Could not authenticate user.' };
      } catch (err: any) {
        return { success: false, error: err.message || 'An unexpected error occurred.' };
      }
    } else {
      // Local sandbox mode
      const rawAccounts = localStorage.getItem(STORAGE_KEY_DEMO_ACCOUNTS);
      const accounts: Array<{ email: string; passHash?: string; pass?: string; fullName: string }> = rawAccounts
        ? JSON.parse(rawAccounts)
        : [];
      const match = accounts.find(a => a.email.toLowerCase() === cleanEmail);

      if (!match) {
        return {
          success: false,
          error: 'No sandbox account found for this email. Create an account first or use Google Demo.'
        };
      }

      const enteredHash = await hashDemoPassword(password);
      const isMatch = match.passHash ? match.passHash === enteredHash : match.pass === password;
      if (!isMatch) {
        return { success: false, error: 'Invalid email or password. Please verify your credentials.' };
      }

      const demoUser: AuthUser = {
        id: `demo-${cleanEmail.replace(/[^a-z0-9]/g, '')}`,
        email: cleanEmail,
        fullName: match.fullName || cleanEmail.split('@')[0],
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
      localStorage.setItem(STORAGE_KEY_DEMO_USER, JSON.stringify(demoUser));
      closeAuthModal();
      return { success: true };
    }
  };

  // Sign Up with Email & Password
  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    if (!cleanEmail || !password || !cleanName) {
      return { success: false, error: 'All fields are required.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        // Supabase returns empty identities array if email is already registered (when email enumeration protection is on)
        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          return {
            success: false,
            error: 'An account with this email already exists. Please sign in or reset your password.'
          };
        }

        if (data.session && data.user) {
          setUser(mapSupabaseUser(data.user));
          closeAuthModal();
          return { success: true, message: 'Account created successfully!' };
        }

        return {
          success: true,
          needsConfirmation: true,
          message: 'Account created! Please check your email inbox and click the confirmation link before signing in.'
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'An unexpected error occurred during signup.' };
      }
    } else {
      // Local sandbox mode
      const rawAccounts = localStorage.getItem(STORAGE_KEY_DEMO_ACCOUNTS);
      const accounts: Array<{ email: string; passHash?: string; pass?: string; fullName: string }> = rawAccounts
        ? JSON.parse(rawAccounts)
        : [];
      if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const passHash = await hashDemoPassword(password);
      accounts.push({ email: cleanEmail, passHash, fullName: cleanName });
      localStorage.setItem(STORAGE_KEY_DEMO_ACCOUNTS, JSON.stringify(accounts));

      const demoUser: AuthUser = {
        id: `demo-${cleanEmail.replace(/[^a-z0-9]/g, '')}`,
        email: cleanEmail,
        fullName: cleanName,
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
      localStorage.setItem(STORAGE_KEY_DEMO_USER, JSON.stringify(demoUser));
      closeAuthModal();
      return { success: true, message: 'Account created successfully!' };
    }
  };

  // Passwordless Email Magic Link
  const signInWithMagicLink = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return {
          success: true,
          message: `Magic sign-in link sent to ${cleanEmail}! Check your inbox.`
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send magic link.' };
      }
    } else {
      return {
        success: true,
        message: 'Magic link simulated (Sandbox Mode). Add your Supabase Project URL to send live one-time email links.'
      };
    }
  };

  // Resend Confirmation Email
  const resendConfirmationEmail = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address first.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: cleanEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return {
          success: true,
          message: `Verification email re-sent to ${cleanEmail}.`
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to resend confirmation email.' };
      }
    } else {
      return {
        success: true,
        message: 'Sandbox accounts do not require email confirmation.'
      };
    }
  };

  // Sign In with Google OAuth
  const signInWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to initiate Google authentication.' };
      }
    } else {
      // Demo simulated Google Sign In
      const demoUser: AuthUser = {
        id: `google-demo-${Date.now()}`,
        email: 'user.atelier@gmail.com',
        fullName: 'Alex Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
      localStorage.setItem(STORAGE_KEY_DEMO_USER, JSON.stringify(demoUser));
      closeAuthModal();
      return { success: true };
    }
  };

  // Send Password Reset Email
  const sendPasswordResetEmail = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return {
          success: true,
          message: 'Password reset link sent! Check your email inbox for instructions.'
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send reset email.' };
      }
    } else {
      return {
        success: true,
        message: 'Password reset link sent (Sandbox Mode)! In live mode, an official reset email is dispatched via Supabase.'
      };
    }
  };

  // Update Password (after recovery link clicked OR from account settings)
  const updatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          setUser(mapSupabaseUser(data.user));
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to update password.' };
      }
    } else {
      if (user) {
        const rawAccounts = localStorage.getItem(STORAGE_KEY_DEMO_ACCOUNTS);
        const accounts: Array<{ email: string; passHash?: string; pass?: string; fullName: string }> = rawAccounts
          ? JSON.parse(rawAccounts)
          : [];
        const passHash = await hashDemoPassword(newPassword);
        const idx = accounts.findIndex(a => a.email.toLowerCase() === user.email.toLowerCase());
        if (idx !== -1) {
          accounts[idx] = { ...accounts[idx], passHash };
          localStorage.setItem(STORAGE_KEY_DEMO_ACCOUNTS, JSON.stringify(accounts));
        }
      }
      return { success: true };
    }
  };

  // Update Display Name
  const updateProfile = async (fullName: string) => {
    const cleanName = fullName.trim();
    if (!cleanName) {
      return { success: false, error: 'Full name cannot be empty.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          data: { full_name: cleanName }
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          setUser(mapSupabaseUser(data.user));
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to update profile.' };
      }
    } else if (user) {
      const updatedUser = { ...user, fullName: cleanName };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY_DEMO_USER, JSON.stringify(updatedUser));
      return { success: true };
    }
    return { success: false, error: 'Not authenticated.' };
  };

  // Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_DEMO_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isSupabaseConfigured,
        hasUrl: hasSupabaseUrl,
        hasApiKey: hasSupabaseApiKey,
        isAuthModalOpen,
        authModalView,
        externalError,
        clearExternalError,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        signInWithEmail,
        signUpWithEmail,
        signInWithMagicLink,
        resendConfirmationEmail,
        signInWithGoogle,
        sendPasswordResetEmail,
        updatePassword,
        updateProfile,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
