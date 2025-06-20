import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Calendar, Settings, Users, Database, BarChart3, Menu, X } from 'lucide-react';
import { UploadManager } from './UploadManager';
import { ScheduleManager } from './ScheduleManager';
import { LiveControl } from './LiveControl';
import { UserMonitor } from './UserMonitor';
import { BackupManager } from './BackupManager';
import { useAuth } from '../../contexts/AuthContext';

type TabType = 'overview' | 'upload' | 'schedule' | 'live' | 'users' | 'backup';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'upload' as TabType, label: 'Upload', icon: Upload },
    { id: 'schedule' as TabType, label: 'Schedule', icon: Calendar },
    { id: 'live' as TabType, label: 'Live Control', icon: Settings },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'backup' as TabType, label: 'Backup', icon: Database },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-white/60 font-body">Manage Marconi's content and operations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-heading font-bold text-white">5,247</h3>
                <p className="text-white/60 font-body">Active Users</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-heading font-bold text-white">247</h3>
                <p className="text-white/60 font-body">Live Viewers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-heading font-bold text-white">89</h3>
                <p className="text-white/60 font-body">Uploaded Files</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-heading font-bold text-white">12hrs</h3>
                <p className="text-white/60 font-body">Daily Content</p>
              </div>
            </div>
          </div>
        );
      case 'upload':
        return <UploadManager />;
      case 'schedule':
        return <ScheduleManager />;
      case 'live':
        return <LiveControl />;
      case 'users':
        return <UserMonitor />;
      case 'backup':
        return <BackupManager />;
      default:
        return <UploadManager />;
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
          <h1 className="text-xl font-heading font-semibold text-white">Admin Panel</h1>
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
        <main className="pt-20 md:pt-8 px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}