import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Calendar, Users, Database, BarChart3, Menu, X, Music, Play, Pause } from 'lucide-react';
import { UploadManager } from './UploadManager';
import { ScheduleManager } from './ScheduleManager';
import { UserMonitor } from './UserMonitor';
import { BackupManager } from './BackupManager';
import { useRadio } from '../../contexts/RadioContext';

type TabType = 'overview' | 'upload' | 'schedule' | 'users' | 'backup';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { radioState, audioFiles } = useRadio();

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'schedule' as TabType, label: 'Schedule Radio', icon: Calendar },
    { id: 'upload' as TabType, label: 'Upload Music', icon: Upload },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'backup' as TabType, label: 'Backup', icon: Database },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                <span className="text-red-400 font-medium text-sm uppercase tracking-wider">Admin Control</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Radio</span> Scheduler
              </h1>
              <p className="text-white/70 font-body text-lg max-w-2xl">Schedule and manage radio broadcasts. All users will listen in perfect sync during scheduled times.</p>
            </div>

            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${radioState?.isPlaying ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-white font-medium">Radio Status</span>
                </div>
                <p className="text-white/60 text-sm">
                  {radioState?.isPlaying ? 'Broadcasting' : 'Offline'}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${radioState?.isScheduled ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                  <span className="text-white font-medium">Scheduling</span>
                </div>
                <p className="text-white/60 text-sm">
                  {radioState?.isScheduled ? 'Active Schedule' : 'No Schedule'}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Music Library</span>
                </div>
                <p className="text-white/60 text-sm">{audioFiles.length} tracks</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Current Track</span>
                </div>
                <p className="text-white/60 text-sm">
                  {radioState?.currentTrack?.songName || radioState?.currentTrack?.fileName || 'None'}
                </p>
              </div>
            </div>

            {/* Current Playing/Scheduled Track */}
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
                          : radioState.isScheduled
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {radioState.isPlaying ? (
                          <>
                            <Play className="h-3 w-3 fill-current" />
                            {radioState.isScheduled ? 'Scheduled Live' : 'Live'}
                          </>
                        ) : radioState.isScheduled ? (
                          <>
                            <Calendar className="h-3 w-3" />
                            Scheduled
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3" />
                            Offline
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
                    {radioState.isScheduled && radioState.scheduledStartTime && radioState.scheduledEndTime && (
                      <p className="text-purple-300 text-xs mt-1">
                        Scheduled: {new Date(radioState.scheduledStartTime).toLocaleString()} - {new Date(radioState.scheduledEndTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-blue-300 font-semibold mb-2">How Radio Scheduling Works</h3>
              <ul className="text-blue-200/80 text-sm space-y-1">
                <li>• Schedule broadcasts to play automatically at specific times</li>
                <li>• All users will hear the same audio in perfect sync</li>
                <li>• Tracks will loop during the scheduled duration</li>
                <li>• Broadcasts start and stop automatically - no manual control needed</li>
                <li>• Perfect for unattended radio operation like a real radio station</li>
              </ul>
            </div>
          </div>
        );
      case 'upload':
        return <UploadManager />;
      case 'schedule':
        return <ScheduleManager />;
      case 'users':
        return <UserMonitor />;
      case 'backup':
        return <BackupManager />;
      default:
        return <ScheduleManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
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
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-heading font-bold text-white tracking-wide">Radio Scheduler</h1>
          </div>
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
      </div>

      {/* Main Content */}
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
