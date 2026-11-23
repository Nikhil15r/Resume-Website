import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CVProvider } from './context/CVContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { EditorPage } from './pages/EditorPage';
import { LatexStudioPage } from './pages/LatexStudioPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Don't render top Navbar on full workspace editor or standalone latex studio
  const isFullWorkspace = location.pathname.startsWith('/editor') || location.pathname === '/latex' || location.pathname === '/cover-letters' || location.pathname.startsWith('/auth');

  return (
    <>
      {!isFullWorkspace && <Navbar />}
      {children}
      <AuthModal />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CVProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/editor/:id" element={<EditorPage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/latex" element={<LatexStudioPage />} />
              <Route path="/cover-letters" element={<CoverLetterPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/auth/reset-password" element={<AuthCallbackPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </CVProvider>
    </AuthProvider>
  );
};

export default App;
