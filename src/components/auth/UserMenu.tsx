import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileCode, ChevronDown, Shield, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UserMenu: React.FC = () => {
  const { user, signOut, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-sm bg-white hover:bg-[#EFEEEA] border border-[#E5E3DF] transition-colors shadow-subtle group"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-6 h-6 rounded-full object-cover border border-[#E5E3DF]"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px] font-mono font-bold tracking-tight">
            {initials}
          </div>
        )}

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-[#0A0A0A] leading-none line-clamp-1 max-w-[120px]">
            {user.fullName}
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-[#807D7A] group-hover:text-[#0A0A0A] transition-transform duration-200" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E3DF] rounded shadow-xl py-2 z-50 animate-in fade-in duration-150">
          <div className="px-4 py-2.5 border-b border-[#E5E3DF] bg-[#FAF9F7]">
            <div className="text-xs font-bold text-[#0A0A0A] truncate">
              {user.fullName}
            </div>
            <div className="text-[11px] text-[#807D7A] truncate font-mono mt-0.5">
              {user.email}
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-[#8C8172]">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>{user.provider === 'google' ? 'Google OAuth' : 'Email & Password'}</span>
            </div>
          </div>

          <div className="py-1">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#0A0A0A] hover:bg-[#EFEEEA] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#8C8172]" />
              <span>Workspace Dashboard</span>
            </Link>

            <Link
              to="/latex"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#0A0A0A] hover:bg-[#EFEEEA] transition-colors"
            >
              <FileCode className="w-4 h-4 text-[#8C8172]" />
              <span>LaTeX Typeset Studio</span>
            </Link>

            {user.provider === 'email' && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openAuthModal('reset_password');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#0A0A0A] hover:bg-[#EFEEEA] transition-colors text-left"
              >
                <KeyRound className="w-4 h-4 text-[#8C8172]" />
                <span>Change Password</span>
              </button>
            )}
          </div>

          <div className="border-t border-[#E5E3DF] pt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
