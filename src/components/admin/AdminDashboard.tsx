import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../../services/appwrite';
import { motion } from 'framer-motion';
import { Upload, Calendar, Users, Database, BarChart3, Menu, X, Music, Play, Pause, Megaphone } from 'lucide-react';
import { UploadManager } from './UploadManager';
import { ScheduleManager } from './ScheduleManager';
import { UserMonitor } from './UserMonitor';
import { BackupManager } from './BackupManager';
import { AnnouncementManager } from './AnnouncementManager';
import { useRadio } from '../../contexts/RadioContext';
import { radioService } from '../../services/appwrite';

type TabType = 'overview' | 'upload' | 'schedule' | 'users' | 'backup' | 'announcements';

// Quick Test Component
function QuickTestSection() {
  const { audioFiles, scheduleTestBroadcast, cancelSchedule } = useRadio();
  const [isScheduling, setIsScheduling] = useState(false);
  
  const handleTestBroadcast = async () => {
    if (audioFiles.length === 0) {
      alert('No audio files available. Please upload some music first.');
      return;
    }
    
    setIsScheduling(true);
    try {
      const firstTrack = audioFiles[0];
      console.log('🧪 Starting test broadcast with:', firstTrack.songName);
      await scheduleTestBroadcast(firstTrack.$id, 10); // 10 minute test
      alert(`Test broadcast scheduled! Playing "${firstTrack.songName}" for 10 minutes.`);
    } catch (error) {
      console.error('Test broadcast failed:', error);
      alert('Failed to schedule test broadcast');
    } finally {
      setIsScheduling(false);
    }
  };
  
  const handleStopTest = async () => {
    try {
      await cancelSchedule();
      alert('Test broadcast stopped');
    } catch (error) {
      console.error('Stop test failed:', error);
      alert('Failed to stop test broadcast');
    }
  };
  
  const handleForceCheck = async () => {
    try {
      console.log('🔧 Manually checking scheduled broadcast...');
      await radioService.checkAndStartScheduledBroadcast();
      alert('Manual broadcast check completed - check console for details');
    } catch (error) {
      console.error('Manual check failed:', error);
      alert('Manual check failed');
    }
  };
  
  return (
    <div className="flex gap-4 flex-wrap">
      <button
        onClick={handleTestBroadcast}
        disabled={isScheduling || audioFiles.length === 0}
        className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isScheduling ? 'Scheduling...' : 'Start Test Broadcast'}
      </button>
      <button
        onClick={handleStopTest}
        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-400"
      >
        Stop Test
      </button>
      <button
        onClick={handleForceCheck}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400"
      >
        Force Check
      </button>
      <div className="text-white/60 text-sm self-center">
        {audioFiles.length} tracks available
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { radioState, audioFiles } = useRadio();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      // Ignore 401 errors (already logged out)
      if (!(error && typeof error === 'object' && 'code' in error && (error as any).code === 401)) {
        console.error('Logout failed:', error);
      }
    } finally {
      navigate('/');
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'schedule' as TabType, label: 'Schedule Radio', icon: Calendar },
    { id: 'upload' as TabType, label: 'Upload Music', icon: Upload },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'announcements' as TabType, label: 'Announcements', icon: Megaphone },
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

            {/* Quick Test Section for Debugging */}
            <div className="bg-yellow-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">🧪 Quick Test (Debug)</h3>
              <p className="text-white/70 mb-4">Test the radio sync functionality with a sample broadcast</p>
              <QuickTestSection />
            </div>
          </div>
        );
      case 'upload':
        return <UploadManager />;
      case 'schedule':
        return <ScheduleManager />;
      case 'users':
        return <UserMonitor />;
      case 'announcements':
        return <AnnouncementManager />;
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
            {/* Logout button below nav */}
            <button
              className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-left font-body bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={handleLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
              Logout
            </button>
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