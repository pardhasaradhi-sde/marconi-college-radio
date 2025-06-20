import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StreamProvider } from './contexts/StreamContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGetStart = () => {
    if (user) {
      // User is already logged in, no need to show modal
      return;
    }
    setShowLoginModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="font-body">Loading Marconi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar onLoginClick={() => setShowLoginModal(true)} />
        <LandingPage onGetStarted={handleGetStart} />
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <StreamProvider>
        <AppContent />
      </StreamProvider>
    </AuthProvider>
  );
}

export default App;