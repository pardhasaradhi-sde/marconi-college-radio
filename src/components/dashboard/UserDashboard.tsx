import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Megaphone, User, LogOut, Radio } from 'lucide-react';
import { StreamPlayer } from './StreamPlayer_vintage';
import { MiniPlayer } from './MiniPlayer';
import { AnnouncementView } from './AnnouncementView';
import { ProfileView } from './ProfileView';
import { useAuth } from '../../contexts/AuthContext';
import { useBackgroundAudio } from '../../hooks/useBackgroundAudio';

type TabType = 'home' | 'announcements' | 'profile';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { user, logout } = useAuth();

  // Background audio that persists across all tabs
  const backgroundAudio = useBackgroundAudio();

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home, description: 'Live stream and player' },
    { id: 'announcements' as TabType, label: 'Events', icon: Megaphone, description: 'Campus announcements' },
    { id: 'profile' as TabType, label: 'Profile', icon: User, description: 'Your account settings' },
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col h-full w-full">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 sm:mb-8 lg:mb-12 text-center lg:text-left"
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-white mb-2 sm:mb-4">
                Welcome back, <span className="text-accent-300">{user?.name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/80 font-body leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Here's what's happening on Marconi today
              </p>
            </motion.div>

            {/* Main Player Section */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <StreamPlayer backgroundAudio={backgroundAudio} />
              </div>
            </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="h-full w-full pb-20 lg:pb-4">
            <AnnouncementView />
            {/* MiniPlayer positioned outside content flow */}
            {backgroundAudio.currentTrack && (
              <div className="fixed bottom-20 sm:bottom-24 lg:bottom-4 left-4 right-4 lg:left-[336px] lg:right-4 z-30 pointer-events-none">
                <div className="pointer-events-auto">
                  <MiniPlayer backgroundAudio={backgroundAudio} />
                </div>
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="h-full w-full pb-20 lg:pb-4">
            <ProfileView />
            {/* MiniPlayer positioned outside content flow */}
            {backgroundAudio.currentTrack && (
              <div className="fixed bottom-20 sm:bottom-24 lg:bottom-4 left-4 right-4 lg:left-[336px] lg:right-4 z-30 pointer-events-none">
                <div className="pointer-events-auto">
                  <MiniPlayer backgroundAudio={backgroundAudio} />
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary-950 text-white font-body">
      {/* Persistent Audio Element */}
      <audio ref={backgroundAudio.audioRef} loop preload="auto" />

      {/* Universal Header - Desktop & Mobile */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 rounded-2xl mx-2 mt-2 lg:rounded-none lg:mx-0 lg:mt-0"
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="flex items-center justify-center px-4 lg:px-6 py-3 lg:py-4">
          {/* Centered Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <Radio className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-lg lg:text-xl font-heading font-bold text-white">Marconi Radio</h1>
              <p className="text-xs lg:text-sm text-white/60 font-body">Vocals of Anurag University</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-80 lg:flex lg:flex-col lg:z-40 pt-[4.5rem]"
      >
        <div className="flex flex-col flex-1 min-h-0 bg-white/5 backdrop-blur-xl border-r border-white/10">
          {/* User Info at the top of the sidebar */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar Navigation */}
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <nav className="flex-1 px-4 space-y-2">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative w-full flex items-center gap-4 px-4 py-3 text-left rounded-2xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-accent-500/20 to-accent-600/20 text-white border border-accent-400/30'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabDesktop"
                      className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-accent-600/10 rounded-2xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className={`relative z-10 p-2 rounded-xl transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-accent-500/20 text-accent-300' 
                      : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                  }`}>
                    <tab.icon className="h-5 w-5" />
                  </div>
                  <div className="relative z-10 flex-1 min-w-0">
                    <p className="text-sm font-medium">{tab.label}</p>
                    <p className="text-xs opacity-60">{tab.description}</p>
                  </div>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Logout button at the bottom of the sidebar */}
          <div className="p-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-300 hover:text-red-200 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:pl-80 pt-[3.5rem] lg:pt-[4.5rem]">
        <main className="min-h-[calc(100vh-6rem)] p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-2"
      >
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
          <nav className="flex justify-around items-center p-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id ? 'text-accent-300' : 'text-white/60 hover:text-white'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute inset-0 bg-accent-500/20 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <tab.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>
    </div>
  );
}