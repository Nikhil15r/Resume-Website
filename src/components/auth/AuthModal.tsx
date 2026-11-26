import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Wand2,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function evaluatePasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-[#E5E3DF]' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-emerald-500' };
  return { score: 4, label: 'Strong', color: 'bg-emerald-700' };
}

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalView,
    closeAuthModal,
    setAuthModalView,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    resendConfirmationEmail,
    signInWithGoogle,
    sendPasswordResetEmail,
    updatePassword,
    externalError,
    clearExternalError
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResendPrompt, setShowResendPrompt] = useState(false);

  const passwordStrength = useMemo(() => evaluatePasswordStrength(password), [password]);

  useEffect(() => {
    setError(externalError || null);
    setSuccessMessage(null);
    setShowResendPrompt(false);
    setPassword('');
    setConfirmPassword('');
  }, [authModalView, isAuthModalOpen, externalError]);

  if (!isAuthModalOpen) return null;

  const handleViewSwitch = (view: typeof authModalView) => {
    clearExternalError();
    setAuthModalView(view);
  };

  const handleResendConfirmation = async () => {
    setError(null);
    setResendingEmail(true);
    try {
      const res = await resendConfirmationEmail(email);
      if (res.success) {
        setSuccessMessage(res.message || 'Verification email re-sent.');
        setShowResendPrompt(false);
      } else {
        setError(res.error || 'Could not resend verification email.');
      }
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearExternalError();
    setError(null);
    setSuccessMessage(null);
    setShowResendPrompt(false);
    setLoading(true);

    try {
      if (authModalView === 'signin') {
        const res = await signInWithEmail(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please verify your email and password.');
          if (res.unconfirmedEmail) {
            setShowResendPrompt(true);
          }
        }
      } else if (authModalView === 'signup') {
        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.');
          setLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, fullName);
        if (!res.success) {
          setError(res.error || 'Failed to create account.');
        } else if (res.message) {
          setSuccessMessage(res.message);
          if (res.needsConfirmation) {
            setShowResendPrompt(true);
          }
        }
      } else if (authModalView === 'magic_link') {
        const res = await signInWithMagicLink(email);
        if (!res.success) {
          setError(res.error || 'Failed to send sign-in link.');
        } else {
          setSuccessMessage(res.message || 'Sign-in link sent! Check your email inbox.');
        }
      } else if (authModalView === 'forgot_password') {
        const res = await sendPasswordResetEmail(email);
        if (!res.success) {
          setError(res.error || 'Failed to send reset email.');
        } else {
          setSuccessMessage(res.message || 'Password reset link sent to your email.');
        }
      } else if (authModalView === 'reset_password') {
        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        const res = await updatePassword(password);
        if (!res.success) {
          setError(res.error || 'Failed to update password.');
        } else {
          setSuccessMessage('Password successfully updated!');
          setTimeout(() => closeAuthModal(), 1500);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearExternalError();
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || 'Google authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-[#E5E3DF] rounded shadow-2xl overflow-hidden flex flex-col relative my-auto"
      >
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#E5E3DF] bg-[#FAF9F7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#0A0A0A] flex items-center justify-center text-white font-serif font-bold text-sm tracking-widest shadow-subtle">
              A
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#0A0A0A] leading-tight">
                {authModalView === 'signin' && 'Welcome Back'}
                {authModalView === 'signup' && 'Create Your Account'}
                {authModalView === 'magic_link' && 'Email Sign-In Link'}
                {authModalView === 'forgot_password' && 'Reset Password'}
                {authModalView === 'reset_password' && 'Update Password'}
              </h2>
              <p className="text-[11px] text-[#807D7A]">
                {authModalView === 'signin' && 'Sign in to access your Atelier CV workspace'}
                {authModalView === 'signup' && 'Create an account to build executive-ready CVs'}
                {authModalView === 'magic_link' && 'Receive a secure 1-click sign-in link via email'}
                {authModalView === 'forgot_password' && 'Enter your email to receive a recovery link'}
                {authModalView === 'reset_password' && 'Enter your new account password'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 text-[#807D7A] hover:text-[#0A0A0A] hover:bg-[#EFEEEA] rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 space-y-4">
          {/* Error Message Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-snug">{error}</div>
              </div>
              {showResendPrompt && (
                <button
                  type="button"
                  disabled={resendingEmail}
                  onClick={handleResendConfirmation}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-900 underline hover:text-red-700 ml-6"
                >
                  <Send className="w-3 h-3" />
                  <span>{resendingEmail ? 'Resending...' : 'Resend confirmation email'}</span>
                </button>
              )}
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-snug">{successMessage}</div>
              </div>
              {showResendPrompt && (
                <button
                  type="button"
                  disabled={resendingEmail}
                  onClick={handleResendConfirmation}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-900 underline hover:text-emerald-700 ml-6"
                >
                  <Send className="w-3 h-3" />
                  <span>{resendingEmail ? 'Sending...' : "Didn't receive it? Resend email"}</span>
                </button>
              )}
            </div>
          )}

          {/* Google OAuth Button (Available on Sign In, Sign Up, Magic Link) */}
          {(authModalView === 'signin' || authModalView === 'signup' || authModalView === 'magic_link') && (
            <>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF9F7] text-[#0A0A0A] border border-[#D1CECA] hover:border-[#8C8172] text-xs font-medium rounded transition-all shadow-subtle flex items-center justify-center gap-3 group disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {authModalView === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
                </span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#E5E3DF] w-full" />
                <span className="bg-white px-3 text-[11px] font-mono uppercase tracking-wider text-[#807D7A] absolute">
                  or with email
                </span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name (Sign Up only) */}
            {authModalView === 'signup' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#807D7A] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#807D7A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F7] border border-[#E5E3DF] rounded focus:border-[#8C8172] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address (All except reset_password) */}
            {authModalView !== 'reset_password' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#807D7A] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#807D7A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F7] border border-[#E5E3DF] rounded focus:border-[#8C8172] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password (Sign In, Sign Up, Reset Password) */}
            {(authModalView === 'signin' || authModalView === 'signup' || authModalView === 'reset_password') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#807D7A]">
                    {authModalView === 'reset_password' ? 'New Password' : 'Password'}
                  </label>
                  {authModalView === 'signin' && (
                    <button
                      type="button"
                      onClick={() => handleViewSwitch('forgot_password')}
                      className="text-[11px] text-[#8C8172] hover:text-[#0A0A0A] transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#807D7A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={authModalView === 'signin' ? undefined : 8}
                    autoComplete={authModalView === 'signin' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs bg-[#FAF9F7] border border-[#E5E3DF] rounded focus:border-[#8C8172] focus:bg-white focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="p-1 text-[#807D7A] hover:text-[#0A0A0A] absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter (Sign Up & Reset Password) */}
                {(authModalView === 'signup' || authModalView === 'reset_password') && password.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map(level => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full transition-colors ${
                            passwordStrength.score >= level ? passwordStrength.color : 'bg-[#E5E3DF]'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-[#807D7A]">
                      <span>Minimum 8 characters required</span>
                      <span className="font-semibold text-[#0A0A0A]">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password (Sign Up & Reset Password) */}
            {(authModalView === 'signup' || authModalView === 'reset_password') && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#807D7A] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#807D7A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F7] border border-[#E5E3DF] rounded focus:border-[#8C8172] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded shadow-subtle flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalView === 'signin' && 'Sign In'}
                    {authModalView === 'signup' && 'Create Account'}
                    {authModalView === 'magic_link' && 'Send Sign-In Link'}
                    {authModalView === 'forgot_password' && 'Send Recovery Email'}
                    {authModalView === 'reset_password' && 'Update Password'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Secondary Login Option: Magic Link toggle */}
          {authModalView === 'signin' && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => handleViewSwitch('magic_link')}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#8C8172] hover:text-[#0A0A0A] transition-colors"
              >
                <Wand2 className="w-3 h-3" />
                <span>Sign in with passwordless Email Link</span>
              </button>
            </div>
          )}

          {/* Bottom Switch Links */}
          <div className="pt-2 text-center text-xs text-[#807D7A] border-t border-[#E5E3DF]">
            {authModalView === 'signin' && (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleViewSwitch('signup')}
                  className="font-semibold text-[#0A0A0A] hover:text-[#8C8172] underline ml-1"
                >
                  Create one now
                </button>
              </p>
            )}

            {authModalView === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleViewSwitch('signin')}
                  className="font-semibold text-[#0A0A0A] hover:text-[#8C8172] underline ml-1"
                >
                  Sign in
                </button>
              </p>
            )}

            {(authModalView === 'forgot_password' || authModalView === 'reset_password' || authModalView === 'magic_link') && (
              <p>
                {authModalView === 'magic_link' ? 'Prefer your password?' : 'Remembered your password?'}{' '}
                <button
                  type="button"
                  onClick={() => handleViewSwitch('signin')}
                  className="font-semibold text-[#0A0A0A] hover:text-[#8C8172] underline ml-1"
                >
                  Return to sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
