import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Megaphone, User, LogOut, Menu, X, Radio } from 'lucide-react';
import { StreamPlayer } from './StreamPlayer_orb';
import { MiniPlayer } from './MiniPlayer';
import { AnnouncementView } from './AnnouncementView';
import { ProfileView } from './ProfileView';
import { useAuth } from '../../contexts/AuthContext';
import { useBackgroundAudio } from '../../hooks/useBackgroundAudio';

type TabType = 'home' | 'announcements' | 'profile';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  // Background audio that persists across all tabs
  const backgroundAudio = useBackgroundAudio();

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home, description: 'Listen to live streams' },
    { id: 'announcements' as TabType, label: 'Events', icon: Megaphone, description: 'Campus announcements' },
    { id: 'profile' as TabType, label: 'Profile', icon: User, description: 'Your account settings' },
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
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
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900">
      {/* Universal Header - Desktop & Mobile */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-primary-900/95 backdrop-blur-xl border-b border-white/10"
      >
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
          {/* Left Side - Marconi Radio */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <Radio className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-heading font-bold text-white">Marconi Radio</h1>
              <p className="text-xs lg:text-sm text-white/60 font-body">Vocals of Anurag University</p>
            </div>
          </div>
          
          {/* Right Side - User Account & Controls */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* User Info - Hidden on small mobile, shown on larger screens */}
            <div className="hidden sm:flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
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

            {/* Action Buttons */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="w-8 h-8 lg:w-10 lg:h-10 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-xl rounded-lg border border-red-400/20 flex items-center justify-center text-red-300 hover:text-red-200 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>
            
            {/* Mobile Menu Button - Only on mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 flex items-center justify-center shadow-lg"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 text-white" />
              ) : (
                <Menu className="h-4 w-4 text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-80 lg:flex lg:flex-col lg:z-40 lg:pt-20"
      >
        <div className="flex flex-col flex-1 min-h-0 bg-white/5 backdrop-blur-xl border-r border-white/10">
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
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-primary-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full p-6 pt-20">
                {/* Mobile Menu Header */}
                <div className="mb-8">
                  <h3 className="text-lg font-heading font-semibold text-white mb-2">Navigation</h3>
                  <p className="text-sm text-white/60">Switch between sections</p>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-3 flex-1">
                  {tabs.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-accent-500/20 to-accent-600/20 text-white border border-accent-400/30'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className={`p-3 rounded-xl transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-accent-500/20 text-accent-300' 
                          : 'bg-white/10 text-white/60'
                      }`}>
                        <tab.icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{tab.label}</p>
                        <p className="text-xs opacity-60">{tab.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </nav>

                {/* Mobile User Info - Show on small screens */}
                <div className="sm:hidden pt-6 border-t border-white/10">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
                    <div className="flex items-center gap-3">
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
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-80 pt-20">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto h-full">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:hidden fixed bottom-4 left-4 right-4 z-30"
      >
        <div 
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-2"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0.15) 100%)`,
          }}
        >
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-t from-accent-500/30 to-accent-400/30 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute inset-0 bg-gradient-to-t from-accent-500/20 to-accent-400/20 rounded-xl border border-accent-400/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <tab.icon className="h-5 w-5 relative z-10" />
                <span className="text-xs font-medium relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Background Audio */}
      <audio
        ref={backgroundAudio.audioRef}
        onLoadedMetadata={() => {
          if (backgroundAudio.audioRef.current && backgroundAudio.currentTrack) {
            const audioDuration = backgroundAudio.audioRef.current.duration;
            backgroundAudio.audioRef.current.volume = 0.5;
            
            console.log('🎵 Background audio loaded:', {
              fileName: backgroundAudio.currentTrack?.fileName,
              songName: backgroundAudio.currentTrack?.songName,
              databaseDuration: backgroundAudio.currentTrack?.duration,
              actualAudioDuration: audioDuration,
              durationMismatch: backgroundAudio.currentTrack?.duration !== audioDuration
            });
            
            if (backgroundAudio.currentTrack && Math.abs((backgroundAudio.currentTrack.duration || 0) - audioDuration) > 1) {
              console.warn('⚠️ Duration mismatch detected - database should be updated');
            }
          }
        }}
      />
    </div>
  );
}