import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    // Check if path is password reset
    if (window.location.pathname.includes('reset-password')) {
      openAuthModal('reset_password');
    }
    // Clean up URL and redirect to dashboard
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 600);

    return () => clearTimeout(timer);
  }, [navigate, openAuthModal]);

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col items-center justify-center p-4">
      <div className="p-8 bg-white border border-[#E5E3DF] rounded shadow-paper text-center space-y-3 max-w-sm w-full">
        <RefreshCw className="w-6 h-6 text-[#8C8172] animate-spin mx-auto" />
        <h3 className="font-serif text-base font-semibold text-[#0A0A0A]">
          Completing Authentication...
        </h3>
        <p className="text-xs text-[#807D7A]">
          Synchronizing your secure session with Atelier CV.
        </p>
      </div>
    </div>
  );
};
