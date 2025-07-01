import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Megaphone, User, Menu, X } from 'lucide-react';
import { StreamPlayer } from './StreamPlayer_orb';
import { AnnouncementView } from './AnnouncementView';
import { ProfileView } from './ProfileView';
import { useAuth } from '../../contexts/AuthContext';

type TabType = 'home' | 'announcements' | 'profile';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'announcements' as TabType, label: 'Events', icon: Megaphone },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {/* Welcome text positioned lower and avoiding sidebar */}
            <div className="fixed top-36 md:top-28 left-1/2 md:left-1/2 md:ml-4 transform -translate-x-1/2 z-20 text-center px-4 max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-lg md:text-xl text-white/60 font-body">Here's what's happening on Marconi today</p>
            </div>
            {/* Orb will be positioned using fixed positioning from its own component */}
            <StreamPlayer />
          </>
        );
      case 'announcements':
        return <AnnouncementView />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <>
            {/* Welcome text positioned lower and avoiding sidebar */}
            <div className="fixed top-36 md:top-28 left-1/2 md:left-1/2 md:ml-4 transform -translate-x-1/2 z-20 text-center px-4 max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-lg md:text-xl text-white/60 font-body">Here's what's happening on Marconi today</p>
            </div>
            <StreamPlayer />
          </>
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
      </motion.div>      {/* Mobile Header - Floating Liquid Glass */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="md:hidden fixed top-4 left-4 right-4 z-50 rounded-2xl overflow-hidden"
        style={{
          backdropFilter: 'blur(20px)',
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.15) 100%)`,
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
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'linear-gradient(90deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))',
              'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(236, 72, 153, 0.2))',
              'linear-gradient(90deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))'
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative flex items-center justify-between px-6 py-4">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-lg">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-white">Marconi</h1>
              <p className="text-xs text-white/60">Dashboard</p>
            </div>
          </motion.div>
          
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden"
            style={{
              backdropFilter: 'blur(20px)',
              background: `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.06) 50%,
                rgba(255, 255, 255, 0.12) 100%)`,
              boxShadow: `
                0 10px 25px rgba(0, 0, 0, 0.3),
                0 5px 10px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `
            }}
          >
            <nav className="p-4 space-y-2">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 font-body ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-accent-500/80 to-accent-600/80 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={activeTab === tab.id ? {
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  } : {}}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="md:pl-[280px] pt-24 md:pt-6">
        <main className="px-4 pb-20 md:pb-8 min-h-screen">
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
        
        <div className="relative grid grid-cols-3 gap-2 p-3">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 ${
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
              <tab.icon size={20} className="relative z-10" />
              <span className="text-xs font-body font-medium relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}