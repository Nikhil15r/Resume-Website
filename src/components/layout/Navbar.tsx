import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useCV } from '../../context/CVContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentDoc } = useCV();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Templates', path: '/templates' },
    { label: 'LaTeX Studio', path: '/latex' },
    { label: 'Cover Letters', path: '/cover-letters' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#F5F5F3]/90 backdrop-blur-md border-b border-[#E5E3DF] transition-luxury no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-sm bg-[#0A0A0A] flex items-center justify-center text-white font-serif font-bold text-sm tracking-widest group-hover:bg-[#8C8172] transition-colors">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-medium tracking-[0.06em] text-[#0A0A0A]">
                ATELIER CV
              </span>
              <span className="text-[9px] font-sans uppercase tracking-[0.22em] text-[#807D7A] -mt-0.5">
                Executive Editions
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium tracking-wide rounded-sm transition-luxury ${
                  isActive(link.path)
                    ? 'text-[#0A0A0A] bg-[#EFEEEA] font-semibold'
                    : 'text-[#807D7A] hover:text-[#0A0A0A] hover:bg-[#EFEEEA]/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to={`/editor/${currentDoc.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-[#F5F5F3] text-xs uppercase tracking-[0.12em] font-medium rounded-sm transition-luxury shadow-subtle group"
            >
              <span>Launch Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm text-[#0A0A0A] hover:bg-[#EFEEEA] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E3DF] bg-[#F5F5F3] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-medium rounded-sm ${
                isActive(link.path)
                  ? 'bg-[#EFEEEA] text-[#0A0A0A]'
                  : 'text-[#807D7A] hover:text-[#0A0A0A] hover:bg-[#EFEEEA]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              to={`/editor/${currentDoc.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 bg-[#0A0A0A] text-white text-xs uppercase tracking-[0.12em] font-medium rounded-sm"
            >
              Launch Studio
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
