import { User, Mail, Monitor, LogOut, Shield } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export function ProfileView() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full max-w-none space-y-4 sm:space-y-6 px-0 pb-4">
      {/* Header */}
      <div className="text-center lg:text-left px-4 lg:px-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white mb-2">Profile</h2>
        <p className="text-sm sm:text-base text-white/60 font-body">Manage your account and preferences</p>
      </div>

      {/* Main Profile Content */}
      <div className="grid gap-4 sm:gap-6 lg:gap-8 px-4 lg:px-0 lg:grid-cols-3 xl:grid-cols-12">
        {/* Profile Info - Takes more space on desktop */}
        <div className="lg:col-span-2 xl:col-span-5">
          <Card glass className="h-full p-4 sm:p-6">
            <div className="flex flex-col items-center lg:items-start gap-4 mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl">
                <User className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-white" />
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-semibold text-white mb-2">{user.name}</h3>
                <p className="text-base sm:text-lg text-white/60 font-body">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 text-white/80">
                <Mail size={20} className="text-accent-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm sm:text-base text-white/60 mb-1">Email Address</p>
                  <p className="font-body text-base sm:text-lg text-white break-all lg:break-normal">{user.email}</p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 text-white/80">
                <Shield size={20} className="text-accent-400 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm sm:text-base text-white/60 mb-1">Account Type</p>
                  <p className="font-body text-base sm:text-lg text-white capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Sessions */}
        <div className="xl:col-span-4">
          <Card glass className="h-full p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-semibold text-white mb-4 sm:mb-6">Active Sessions</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Monitor size={20} className="text-green-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-white text-sm sm:text-base font-medium">Current Session</p>
                    <p className="font-body text-white/60 text-xs sm:text-sm truncate">Chrome on Windows</p>
                  </div>
                </div>
                <span className="text-green-400 text-xs sm:text-sm font-medium bg-green-400/10 px-2 py-1 rounded-lg flex-shrink-0">Active</span>
              </div>
              
              {user.sessions?.slice(1).map((session, index) => (
                <div key={session} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Monitor size={20} className="text-white/60 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-white text-sm sm:text-base">Session {index + 2}</p>
                      <p className="font-body text-white/60 text-xs sm:text-sm truncate">Mobile Device</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm flex-shrink-0 hover:bg-red-500/10 hover:text-red-300">
                    Sign Out
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
              <p className="text-white/60 text-xs sm:text-sm font-body">
                You can be signed in on up to 5 devices simultaneously.
              </p>
            </div>
          </Card>
        </div>

        {/* Account Actions */}
        <div className="xl:col-span-3">
          <Card glass className="h-full p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-semibold text-white mb-4 sm:mb-6">Account Actions</h3>
            
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button variant="secondary" size="lg" className="w-full text-sm sm:text-base justify-start">
                Change Preferences
              </Button>
              <Button variant="secondary" size="lg" className="w-full text-sm sm:text-base justify-start">
                Download Data
              </Button>
              <Button variant="danger" size="lg" icon={LogOut} onClick={logout} className="w-full text-sm sm:text-base justify-start">
                Sign Out
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/60 text-xs sm:text-sm font-body mb-2">
                Need help?
              </p>
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm text-accent-400 hover:text-accent-300 p-0 h-auto">
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}