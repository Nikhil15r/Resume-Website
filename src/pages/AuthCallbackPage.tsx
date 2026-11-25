import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, openAuthModal } = useAuth();
  const [callbackError, setCallbackError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

    const errDesc =
      searchParams.get('error_description') ||
      hashParams.get('error_description') ||
      searchParams.get('error') ||
      hashParams.get('error');

    if (errDesc) {
      const cleanMessage = decodeURIComponent(errDesc.replace(/\+/g, ' '));
      setCallbackError(cleanMessage);
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
        openAuthModal('signin', cleanMessage);
      }, 1500);
      return () => clearTimeout(timer);
    }

    const isRecovery =
      window.location.pathname.includes('reset-password') ||
      searchParams.get('type') === 'recovery' ||
      hashParams.get('type') === 'recovery';

    // Wait until initial session check / PKCE code exchange settles
    if (loading) return;

    let cancelled = false;
    const finalizeAuth = async () => {
      // Ensure any remaining session state is settled
      if (supabase) {
        await supabase.auth.getSession();
      }
      if (cancelled) return;

      if (isRecovery) {
        navigate('/dashboard', { replace: true });
        openAuthModal('reset_password');
      } else {
        navigate('/dashboard', { replace: true });
      }
    };

    const timer = setTimeout(finalizeAuth, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [loading, navigate, openAuthModal]);

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col items-center justify-center p-4">
      <div className="p-8 bg-white border border-[#E5E3DF] rounded shadow-paper text-center space-y-3 max-w-sm w-full">
        {callbackError ? (
          <>
            <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
            <h3 className="font-serif text-base font-semibold text-[#0A0A0A]">
              Authentication Issue
            </h3>
            <p className="text-xs text-red-700 leading-relaxed">{callbackError}</p>
          </>
        ) : (
          <>
            <RefreshCw className="w-6 h-6 text-[#8C8172] animate-spin mx-auto" />
            <h3 className="font-serif text-base font-semibold text-[#0A0A0A]">
              Completing Authentication...
            </h3>
            <p className="text-xs text-[#807D7A]">
              Verifying your secure session with Atelier CV.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
