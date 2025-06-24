import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Calendar, Settings, Users, Database, BarChart3, Menu, X, Music, Play, Pause } from 'lucide-react';
import { UploadManager } from './UploadManager';
import { ScheduleManager } from './ScheduleManager';
import { LiveControl } from './LiveControl';
import { UserMonitor } from './UserMonitor';
import { BackupManager } from './BackupManager';
import { useRadio } from '../../contexts/RadioContext';

type TabType = 'overview' | 'upload' | 'schedule' | 'live' | 'users' | 'backup';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { radioState, audioFiles } = useRadio();

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'upload' as TabType, label: 'Upload', icon: Upload },
    { id: 'schedule' as TabType, label: 'Schedule', icon: Calendar },
    { id: 'live' as TabType, label: 'Live Control', icon: Settings },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'backup' as TabType, label: 'Backup', icon: Database },
  ];

  const renderContent = () => {
    switch (activeTab) {      case 'overview':
        return (
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                <span className="text-red-400 font-medium text-sm uppercase tracking-wider">Admin Control</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Admin</span> Dashboard
              </h1>              <p className="text-white/70 font-body text-lg max-w-2xl">Manage Marconi's content, operations, and monitor system performance in real-time.</p>
            </div>

            {/* Current Playing Song */}
            {radioState?.currentTrack && (
              <div className="bg-gradient-to-r from-accent-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-accent-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                    {radioState.currentTrack.coverImageUrl ? (
                      <img
                        src={radioState.currentTrack.coverImageUrl}
                        alt={radioState.currentTrack.songName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="h-6 w-6 text-white/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                        radioState.isPlaying 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {radioState.isPlaying ? (
                          <>
                            <Play className="h-3 w-3 fill-current" />
                            Now Playing
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3" />
                            Paused
                          </>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white truncate">
                      {radioState.currentTrack.songName || radioState.currentTrack.fileName}
                    </h3>
                    <p className="text-white/60 text-sm truncate">
                      {radioState.currentTrack.artist || 'Unknown Artist'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <h3 className="text-2xl font-heading font-bold text-white">5,247</h3>
                <p className="text-white/60 font-body">Active Users</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <h3 className="text-2xl font-heading font-bold text-white">247</h3>
                <p className="text-white/60 font-body">Live Viewers</p>
              </div>              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <h3 className="text-2xl font-heading font-bold text-white">{audioFiles.length}</h3>
                <p className="text-white/60 font-body">Uploaded Files</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
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
      {/* Desktop Sidebar */}      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-16 bg-white/5 backdrop-blur-lg border-r border-white/10">
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
      </div>      {/* Mobile Header */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-heading font-bold text-white tracking-wide">Admin Control</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-white/80 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border-b border-white/20 shadow-xl"
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
      </div>      {/* Main Content */}
      <div className="md:pl-64">
        <main className="pt-24 md:pt-20 px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}