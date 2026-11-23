import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalView,
    closeAuthModal,
    setAuthModalView,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPasswordResetEmail,
    updatePassword,
    isConfigured
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showKeyInstructions, setShowKeyInstructions] = useState(false);

  // Reset form inputs when view changes or modal closes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  }, [authModalView, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (authModalView === 'signin') {
        const res = await signInWithEmail(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please verify your email and password.');
        }
      } else if (authModalView === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, fullName);
        if (!res.success) {
          setError(res.error || 'Failed to create account.');
        } else if (res.message) {
          setSuccessMessage(res.message);
        }
      } else if (authModalView === 'forgot_password') {
        const res = await sendPasswordResetEmail(email);
        if (!res.success) {
          setError(res.error || 'Failed to send reset email.');
        } else {
          setSuccessMessage(res.message || 'Password reset link sent to your email.');
        }
      } else if (authModalView === 'reset_password') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        const res = await updatePassword(password);
        if (!res.success) {
          setError(res.error || 'Failed to update password.');
        } else {
          setSuccessMessage('Password successfully updated! You can now sign in.');
          setTimeout(() => setAuthModalView('signin'), 1800);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-[#E5E3DF] rounded shadow-2xl overflow-hidden flex flex-col relative"
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
                {authModalView === 'forgot_password' && 'Reset Password'}
                {authModalView === 'reset_password' && 'Create New Password'}
              </h2>
              <p className="text-[11px] text-[#807D7A]">
                {authModalView === 'signin' && 'Sign in to access and sync your CV portfolio'}
                {authModalView === 'signup' && 'Start crafting executive-ready documents'}
                {authModalView === 'forgot_password' && 'Enter your email to receive a recovery link'}
                {authModalView === 'reset_password' && 'Enter your new secure account password'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 text-[#807D7A] hover:text-[#0A0A0A] hover:bg-[#EFEEEA] rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Backend Status Banner */}
        <div className="px-6 py-2 bg-[#F5F5F3] border-b border-[#E5E3DF] flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-[#807D7A]">
            <span
              className={`w-2 h-2 rounded-full ${
                isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            {isConfigured ? 'Live Supabase Auth (Free)' : 'Demo Sandbox Mode'}
          </span>
          {!isConfigured && (
            <button
              type="button"
              onClick={() => setShowKeyInstructions(prev => !prev)}
              className="text-[#8C8172] hover:text-[#0A0A0A] underline"
            >
              Connect Free API
            </button>
          )}
        </div>

        {/* Setup Guide Collapsible */}
        {showKeyInstructions && !isConfigured && (
          <div className="p-4 bg-amber-50/70 border-b border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
            <div className="font-semibold flex items-center gap-1 text-amber-950">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>How to enable 100% Free Supabase Auth:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-[11px]">
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="font-semibold underline">supabase.com</a> (Free tier: 50,000 active users).</li>
              <li>Under <strong>Project Settings → API</strong>, copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong>.</li>
              <li>Add them to your environment variables or <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>:
                <pre className="mt-1 bg-white p-2 rounded text-[10px] font-mono text-[#0A0A0A] border border-amber-200 select-all">
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
                </pre>
              </li>
              <li>To enable Google login, turn on <strong>Google</strong> under <strong>Authentication → Providers</strong>.</li>
            </ol>
          </div>
        )}

        {/* Modal Form Content */}
        <div className="p-6 space-y-4">
          {/* Error Message Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{error}</div>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{successMessage}</div>
            </div>
          )}

          {/* Google OAuth Button (Available on Sign In and Sign Up) */}
          {(authModalView === 'signin' || authModalView === 'signup') && (
            <>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF9F7] text-[#0A0A0A] border border-[#D1CECA] hover:border-[#8C8172] text-xs font-medium rounded transition-all shadow-subtle flex items-center justify-center gap-3 group"
              >
                {/* Official Google 'G' SVG Logo */}
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
                  {authModalView === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
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
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF9F7] border border-[#E5E3DF] rounded focus:border-[#8C8172] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password (Sign In, Sign Up, Reset Password) */}
            {authModalView !== 'forgot_password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#807D7A]">
                    {authModalView === 'reset_password' ? 'New Password' : 'Password'}
                  </label>
                  {authModalView === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setAuthModalView('forgot_password')}
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
                    {authModalView === 'forgot_password' && 'Send Recovery Email'}
                    {authModalView === 'reset_password' && 'Update Password'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Links */}
          <div className="pt-2 text-center text-xs text-[#807D7A] border-t border-[#E5E3DF]">
            {authModalView === 'signin' && (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalView('signup')}
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
                  onClick={() => setAuthModalView('signin')}
                  className="font-semibold text-[#0A0A0A] hover:text-[#8C8172] underline ml-1"
                >
                  Sign in
                </button>
              </p>
            )}

            {(authModalView === 'forgot_password' || authModalView === 'reset_password') && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalView('signin')}
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
