import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-6 right-6 md:left-[280px] z-50 rounded-2xl overflow-hidden"
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
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <h1 className="text-2xl font-heading font-bold text-white">Marconi</h1>
              <p className="text-sm text-white/70">Vocals of Anurag University</p>
            </div>
          </motion.div>

          {/* Desktop Navigation - positioned absolutely to avoid affecting center alignment */}
          <motion.div 
            className="hidden md:flex items-center gap-6 absolute right-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {user ? (
              <div className="flex items-center gap-6">
                <motion.div 
                  className="text-white/90 text-sm font-medium px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Welcome, {user.name}
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-medium px-6 py-2 rounded-xl transition-all duration-300 shadow-lg"
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
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg"
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}