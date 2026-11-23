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

export type AuthModalView = 'signin' | 'signup' | 'forgot_password' | 'reset_password';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  isAuthModalOpen: boolean;
  authModalView: AuthModalView;
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: AuthModalView) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY_DEMO_USER = 'atelier_auth_demo_user';
const STORAGE_KEY_DEMO_ACCOUNTS = 'atelier_auth_demo_accounts';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('signin');

  const openAuthModal = useCallback((view: AuthModalView = 'signin') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Helper to map Supabase User to AuthUser
  const mapSupabaseUser = (sbUser: any): AuthUser => {
    const meta = sbUser.user_metadata || {};
    const identities = sbUser.identities || [];
    const provider = identities[0]?.provider === 'google' ? 'google' : 'email';
    return {
      id: sbUser.id,
      email: sbUser.email || '',
      fullName: meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'User',
      avatarUrl: meta.avatar_url || meta.picture || undefined,
      provider: provider,
      createdAt: sbUser.created_at
    };
  };

  // Initialize Auth state
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Fetch current session from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      // 2. Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          if (session?.user) {
            setUser(mapSupabaseUser(session.user));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'PASSWORD_RECOVERY') {
          // When user arrives via recovery link in email, open reset password modal
          openAuthModal('reset_password');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Demo / Local development mode fallback when Supabase keys are not set
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
          return { success: false, error: error.message };
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
      // Local demo mode
      const rawAccounts = localStorage.getItem(STORAGE_KEY_DEMO_ACCOUNTS);
      const accounts: Array<{ email: string; pass: string; fullName: string }> = rawAccounts ? JSON.parse(rawAccounts) : [];
      const match = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (match) {
        if (match.pass !== password) {
          return { success: false, error: 'Invalid password. Please check your credentials.' };
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
      } else {
        // Allow instant demo signin if password is at least 6 chars
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters.' };
        }
        const demoUser: AuthUser = {
          id: `demo-${cleanEmail.replace(/[^a-z0-9]/g, '')}`,
          email: cleanEmail,
          fullName: cleanEmail.split('@')[0],
          provider: 'email',
          createdAt: new Date().toISOString()
        };
        setUser(demoUser);
        localStorage.setItem(STORAGE_KEY_DEMO_USER, JSON.stringify(demoUser));
        closeAuthModal();
        return { success: true };
      }
    }
  };

  // Sign Up with Email & Password
  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    if (!cleanEmail || !password || !cleanName) {
      return { success: false, error: 'All fields are required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
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
            emailRedirectTo: window.location.origin
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        // If email confirmation is disabled or user immediately returned
        if (data.session && data.user) {
          setUser(mapSupabaseUser(data.user));
          closeAuthModal();
          return { success: true, message: 'Account created successfully!' };
        }

        return {
          success: true,
          message: 'Account created! Please check your email inbox to confirm your registration.'
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'An unexpected error occurred during signup.' };
      }
    } else {
      // Local demo mode
      const rawAccounts = localStorage.getItem(STORAGE_KEY_DEMO_ACCOUNTS);
      const accounts: Array<{ email: string; pass: string; fullName: string }> = rawAccounts ? JSON.parse(rawAccounts) : [];
      if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      accounts.push({ email: cleanEmail, pass: password, fullName: cleanName });
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

  // Sign In with Google OAuth
  const signInWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
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
      // Demo mode
      return {
        success: true,
        message: 'Password reset link sent (demo mode)! In live mode, an official reset email is dispatched via Supabase.'
      };
    }
  };

  // Update Password (after recovery link clicked)
  const updatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) {
          return { success: false, error: error.message };
        }
        closeAuthModal();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to update password.' };
      }
    } else {
      // Demo mode
      closeAuthModal();
      return { success: true };
    }
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
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        sendPasswordResetEmail,
        updatePassword,
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
