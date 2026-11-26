import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

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

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_UNAVAILABLE_ERROR = 'Authentication service is temporarily unavailable. Please try again later.';

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

  // Clean up any legacy local storage keys if present from earlier sessions
  useEffect(() => {
    try {
      localStorage.removeItem('atelier_auth_demo_user');
      localStorage.removeItem('atelier_auth_demo_accounts');
    } catch {
      // Ignore storage cleanup errors
    }
  }, []);

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

  // Initialize live Supabase Auth state
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.error('Supabase authentication environment variables are missing.');
      setUser(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

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
  }, [openAuthModal]);

  const signInWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: AUTH_UNAVAILABLE_ERROR };
    }

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
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    if (!cleanEmail || !password || !cleanName) {
      return { success: false, error: 'All fields are required.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: AUTH_UNAVAILABLE_ERROR };
    }

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
  };

  const signInWithMagicLink = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: AUTH_UNAVAILABLE_ERROR };
    }

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
        message: `Sign-in link sent to ${cleanEmail}! Check your email inbox.`
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send sign-in link.' };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address first.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: AUTH_UNAVAILABLE_ERROR };
    }

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
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: AUTH_UNAVAILABLE_ERROR };
    }

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
        if (error.message.toLowerCase().includes('provider is not enabled')) {
          return {
            success: false,
            error: 'Google Sign-In is currently unavailable. Please sign in using Email & Password or Magic Link.'
          };
        }
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to initiate Google authentication.' };
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: AUTH_UNAVAILABLE_ERROR };
    }

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
  };

  const updatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: AUTH_UNAVAILABLE_ERROR };
    }

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
  };

  const updateProfile = async (fullName: string) => {
    const cleanName = fullName.trim();
    if (!cleanName) {
      return { success: false, error: 'Full name cannot be empty.' };
    }
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: AUTH_UNAVAILABLE_ERROR };
    }

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
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isSupabaseConfigured,
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
