import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, Radio, User, Menu, X } from 'lucide-react';
import { StreamPlayer } from './StreamPlayer';
import { ScheduleView } from './ScheduleView';
import { ProfileView } from './ProfileView';
import { useAuth } from '../../contexts/AuthContext';

type TabType = 'home' | 'schedule' | 'stream' | 'profile';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'stream' as TabType, label: 'Stream', icon: Radio },
    { id: 'schedule' as TabType, label: 'Schedule', icon: Calendar },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-white/60 font-body">Here's what's happening on Marconi today</p>
            </div>
            <StreamPlayer />
          </div>
        );
      case 'stream':
        return <StreamPlayer />;
      case 'schedule':
        return <ScheduleView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <StreamPlayer />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-20 bg-white/5 backdrop-blur-lg border-r border-white/10">
          <div className="flex flex-col flex-grow px-4 py-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-body ${
                    activeTab === tab.id
                      ? 'bg-accent-500 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-heading font-semibold text-white">Marconi</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-white/80 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border-b border-white/10"
          >
            <nav className="px-4 py-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-body ${
                    activeTab === tab.id
                      ? 'bg-accent-500 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="pt-20 md:pt-8 px-4 pb-20 md:pb-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/10">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-3 transition-all ${
                activeTab === tab.id
                  ? 'text-accent-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-xs font-body">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}