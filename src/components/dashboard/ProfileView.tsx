import { User, Mail, LogOut, Shield, Edit3, X, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Input } from '../ui/Input';
import { Toast } from '../ui/Toast';

export function ProfileView() {
  const { user, logout, updateUserName } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user) return null;

  const handleSave = async () => {
    if (newName.trim() === '' || newName === user.name) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const success = await updateUserName(newName);
    if (success) {
      setToast({ message: 'Username updated successfully!', type: 'success' });
    } else {
      setToast({ message: 'Failed to update username.', type: 'error' });
      setNewName(user.name); // Revert on failure
    }
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-none space-y-6 sm:space-y-8 px-0 pb-4 relative"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          >
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3 sm:mb-4">
          Your Profile
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-body">Manage your account details and preferences</p>
      </div>

      {/* Main Profile Content */}
      <div className="max-w-4xl mx-auto">
        <Card glass className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-2xl"
            >
              <User className="h-12 w-12 sm:h-14 sm:h-14 lg:h-16 lg:w-16 text-white" />
            </motion.div>
            <div className="text-center sm:text-left flex-1">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit-input"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold !bg-white/10 !text-white"
                      autoFocus
                    />
                  </motion.div>
                ) : (
                  <motion.h3 
                    key="display-name"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold text-white mb-2"
                  >
                    {user.name}
                  </motion.h3>
                )}
              </AnimatePresence>
              <p className="text-lg sm:text-xl text-white/60 font-body capitalize">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
            </div>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div key="save-cancel-buttons" className="flex gap-2">
                  <Button onClick={handleSave} variant="primary" size="sm" disabled={isSaving}>
                    {isSaving ? 'Saving...' : <Check size={16} />}
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
                    <X size={16} />
                  </Button>
                </motion.div>
              ) : (
                <motion.button 
                  key="edit-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6 border-t border-white/10 pt-8">
            <div className="flex items-start gap-4 text-white/80">
              <Mail size={20} className="text-accent-400 flex-shrink-0 mt-1" />
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm text-white/60 mb-1">Email Address</p>
                <p className="font-body text-lg text-white break-all">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 text-white/80">
              <Shield size={20} className="text-accent-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-body text-sm text-white/60 mb-1">Account Type</p>
                <p className="font-body text-lg text-white capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex justify-end">
            <Button 
              onClick={logout} 
              variant="danger" 
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}