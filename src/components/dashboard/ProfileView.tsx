import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Monitor, LogOut, Shield } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export function ProfileView() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Profile</h2>
        <p className="text-white/60 font-body">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info */}
        <Card glass className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-white">{user.name}</h3>
              <p className="text-white/60 font-body">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <Mail size={18} />
              <div>
                <p className="font-body text-sm text-white/60">Email Address</p>
                <p className="font-body">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white/80">
              <Shield size={18} />
              <div>
                <p className="font-body text-sm text-white/60">Account Type</p>
                <p className="font-body capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Sessions */}
        <Card glass className="p-6">
          <h3 className="text-lg font-heading font-semibold text-white mb-4">Active Sessions</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor size={18} className="text-white/60" />
                <div>
                  <p className="font-body text-white text-sm">Current Session</p>
                  <p className="font-body text-white/60 text-xs">Chrome on Windows</p>
                </div>
              </div>
              <span className="text-green-400 text-xs font-body">Active</span>
            </div>
            
            {user.sessions.slice(1).map((session, index) => (
              <div key={session} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-white/60" />
                  <div>
                    <p className="font-body text-white text-sm">Session {index + 2}</p>
                    <p className="font-body text-white/60 text-xs">Mobile Device</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Sign Out
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-white/60 text-xs font-body">
              You can be signed in on up to 5 devices simultaneously.
            </p>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card glass className="p-6">
        <h3 className="text-lg font-heading font-semibold text-white mb-4">Account Actions</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" size="sm">
            Change Preferences
          </Button>
          <Button variant="secondary" size="sm">
            Download Data
          </Button>
          <Button variant="danger" size="sm" icon={LogOut} onClick={logout}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}