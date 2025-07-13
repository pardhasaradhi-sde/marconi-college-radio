import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StreamProvider } from './contexts/StreamContext';
import { RadioProvider } from './contexts/RadioContext';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleGetStart = () => {
    if (user) return;
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

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage onGetStarted={handleGetStart} />} />
        {user ? (
          <>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
      {!user && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <RadioProvider>
          <StreamProvider>
            <AppRoutes />
          </StreamProvider>
        </RadioProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;