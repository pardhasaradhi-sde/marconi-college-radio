import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { Toast } from '../ui/Toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const toastTimeout = useRef<number | null>(null);
  const { login, register } = useAuth();

  const showToast = (toastObj: { message: string; type: 'success' | 'error' | 'info' }) => {
    setToast(toastObj);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    if (toastObj.type === 'success') {
      toastTimeout.current = setTimeout(() => setToast(null), 2000);
    }
    // Errors persist until closed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setToast(null);
    try {
      let success = false;
      if (isRegister) {
        if (!name.trim()) {
          setError('Name is required for registration.');
          setIsLoading(false);
          return;
        }
        success = await register(email, password, name);
        if (success) {
          showToast({ message: 'User created! Please log in.', type: 'success' });
        } else {
          showToast({ message: 'Registration failed. Email might already exist or invalid AU email.', type: 'error' });
        }
      } else {
        success = await login(email, password);
        if (success) {
          showToast({ message: 'Login successful!', type: 'success' });
        } else {
          showToast({ message: 'Invalid credentials or email not allowed. Only AU emails (@anurag.edu.in) are permitted.', type: 'error' });
        }
      }
      if (success) {
        setTimeout(() => {
          onClose();
          setEmail('');
          setPassword('');
          setName('');
          setToast(null);
        }, 1200);
      }
    } catch (err) {
      showToast({ message: isRegister ? 'Registration failed. Please try again.' : 'Login failed. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error and toast when switching modes
  const handleSwitchMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setToast(null);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Toast always above modal overlays */}
          <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none">
            {toast && (
              <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
          </div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-accent-400" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-white mb-2">
                  {isRegister ? 'Join Marconi' : 'Welcome to Marconi'}
                </h2>
                <p className="text-white/70 font-body">
                  {isRegister 
                    ? 'Create your account with AU email' 
                    : 'Sign in with your AU email to access exclusive content'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isRegister && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div>
                  <Input
                    type="email"
                    placeholder="your.name@anurag.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3 border border-red-500/20"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isLoading || !email || !password || (isRegister && !name)}
                >
                  {isLoading 
                    ? (isRegister ? 'Creating Account...' : 'Signing In...') 
                    : (isRegister ? 'Create Account' : 'Sign In')
                  }
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <button
                    onClick={handleSwitchMode}
                    className="text-accent-400 hover:text-accent-300 text-sm font-body transition-colors"
                  >
                    {isRegister
                      ? 'Already have an account? Sign In'
                      : "Don't have an account? Register"
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}