import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Megaphone, User } from 'lucide-react';
import { StreamPlayer } from './StreamPlayer_orb';
import { MiniPlayer } from './MiniPlayer';
import { AnnouncementView } from './AnnouncementView';
import { ProfileView } from './ProfileView';
import { useAuth } from '../../contexts/AuthContext';
import { useBackgroundAudio } from '../../hooks/useBackgroundAudio';

type TabType = 'home' | 'announcements' | 'profile';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { user } = useAuth();
  
  // Background audio that persists across all tabs
  const backgroundAudio = useBackgroundAudio();

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'announcements' as TabType, label: 'Events', icon: Megaphone },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="relative h-full">
            {/* Welcome text optimized for mobile with better positioning */}
            <div className="fixed top-24 md:top-28 left-1/2 md:left-1/2 md:ml-4 transform -translate-x-1/2 z-20 text-center px-4 max-w-sm sm:max-w-md md:max-w-3xl mobile-welcome">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-lg sm:text-xl md:text-4xl font-heading font-bold text-white mb-2 leading-tight drop-shadow-lg">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/90 font-body leading-relaxed drop-shadow-md">
                  Here's what's happening on Marconi today
                </p>
              </motion.div>
            </div>
            {/* Radio container for perfect mobile centering */}
            <div className="mobile-radio-container">
              <StreamPlayer backgroundAudio={backgroundAudio} />
            </div>
          </div>
        );
      case 'announcements':
        return (
          <>
            <AnnouncementView />
            {/* Show MiniPlayer when audio is playing */}
            {backgroundAudio.currentTrack && (
              <MiniPlayer backgroundAudio={backgroundAudio} />
            )}
          </>
        );
      case 'profile':
        return (
          <>
            <ProfileView />
            {/* Show MiniPlayer when audio is playing */}
            {backgroundAudio.currentTrack && (
              <MiniPlayer backgroundAudio={backgroundAudio} />
            )}
          </>
        );
      default:
        return (
          <div className="relative h-full">
            {/* Welcome text optimized for mobile */}
            <div className="fixed top-24 md:top-28 left-1/2 md:left-1/2 md:ml-4 transform -translate-x-1/2 z-20 text-center px-4 max-w-sm sm:max-w-md md:max-w-3xl mobile-welcome">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-lg sm:text-xl md:text-4xl font-heading font-bold text-white mb-2 leading-tight drop-shadow-lg">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/90 font-body leading-relaxed drop-shadow-md">
                  Here's what's happening on Marconi today
                </p>
              </motion.div>
            </div>
            <div className="mobile-radio-container">
              <StreamPlayer backgroundAudio={backgroundAudio} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900 p-4">
      {/* Desktop Sidebar - Floating Liquid Glass */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:fixed md:top-6 md:left-6 md:bottom-6 md:w-64 md:flex md:flex-col z-40"
      >
        <div className="flex flex-col flex-grow rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
          style={{
            backdropFilter: 'blur(20px)',
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0.1) 100%)`,
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 10px 20px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-30"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))',
                'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1))',
                'linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))'
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative flex flex-col flex-grow p-6">
            {/* Logo Section */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-lg">
                <Home className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-lg font-heading font-bold text-white">Dashboard</h2>
              <p className="text-xs text-white/60">Welcome back, {user?.name}</p>
            </motion.div>

            {/* Navigation */}
            <nav className="space-y-2 flex-grow">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 font-body relative overflow-hidden ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-accent-500/80 to-accent-600/80 text-white shadow-lg backdrop-blur-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={activeTab === tab.id ? {
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  } : {}}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-500/20 to-accent-600/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <tab.icon size={20} className="relative z-10" />
                  <span className="relative z-10 font-medium text-sm">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>      
      
      {/* Mobile Header removed - using main Navbar instead */}

      {/* Main Content */}
      <div className="md:pl-[280px] pt-20 md:pt-6">
        <main className="px-0 md:px-4 pb-20 md:pb-8 min-h-screen">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-6xl mx-auto h-full"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Floating Liquid Glass */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="md:hidden fixed bottom-4 left-4 right-4 rounded-2xl overflow-hidden"
        style={{
          backdropFilter: 'blur(20px)',
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.06) 50%,
            rgba(255, 255, 255, 0.12) 100%)`,
          boxShadow: `
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 8px 15px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-15"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3))',
              'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3))',
              'linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative grid grid-cols-3 gap-1 p-4">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all duration-300 min-h-[60px] ${
                activeTab === tab.id
                  ? 'bg-gradient-to-t from-accent-500/80 to-accent-400/80 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              style={activeTab === tab.id ? {
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              } : {}}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-t from-accent-500/20 to-accent-400/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon size={22} className="relative z-10" />
              <span className="text-xs font-body font-medium relative z-10 leading-tight">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Background Audio - Always Active */}
      <audio
        ref={backgroundAudio.audioRef}
        onLoadedMetadata={() => {
          if (backgroundAudio.audioRef.current && backgroundAudio.currentTrack) {
            const audioDuration = backgroundAudio.audioRef.current.duration;
            backgroundAudio.audioRef.current.volume = 0.5; // Default volume
            
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