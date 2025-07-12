import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Radio, Menu, X } from 'lucide-react';

interface NavbarProps {
  onLoginClick?: () => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

export function Navbar({ onLoginClick, isMobileMenuOpen, onMobileMenuToggle }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 sm:py-6"
      style={{
        backdropFilter: 'blur(20px)',
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.15) 0%,
          rgba(255, 255, 255, 0.08) 50%,
          rgba(255, 255, 255, 0.15) 100%)`,
        boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.3),
          0 10px 20px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(255, 255, 255, 0.1)
        `
      }}
    >
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-20 rounded-2xl"
          animate={{
            background: [
              'linear-gradient(90deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))',
              'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(236, 72, 153, 0.2))',
              'linear-gradient(90deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Left aligned on desktop, centered on mobile */}
          <motion.div 
            className="flex items-center gap-3 mx-auto md:mx-0"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Radio Icon for branding */}
            <div className="hidden sm:flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-accent-500/20 rounded-xl border border-accent-400/30">
              <Radio className="w-4 h-4 lg:w-5 lg:h-5 text-accent-400" />
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white leading-tight">
                Marconi
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 font-body leading-tight">
                Vocals of Anurag University
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation - Right aligned */}
          <motion.div 
            className="hidden md:flex items-center gap-4 lg:gap-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {user ? (
              <div className="flex items-center gap-4 lg:gap-6">
                <motion.div 
                  className="text-white/90 text-sm lg:text-base font-medium px-3 lg:px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Welcome, {user.name.split(' ')[0]}
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-medium px-4 lg:px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Sign Out
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={onLoginClick}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold px-6 lg:px-8 py-2 lg:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Hamburger Menu - Right aligned */}
          <motion.div 
            className="md:hidden"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMobileMenuToggle}
                className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center shadow-lg"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-white" />
                ) : (
                  <Menu className="h-5 w-5 text-white" />
                )}
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={onLoginClick}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg text-xs"
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}