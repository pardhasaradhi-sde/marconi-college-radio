import { motion } from 'framer-motion';
import { Radio, Play, Pause } from 'lucide-react';
import { useRadio } from '../../contexts/RadioContext';

interface StreamPlayerProps {
  backgroundAudio?: {
    audioRef: React.RefObject<HTMLAudioElement>;
    isPlaying: boolean;
    isUserPaused: boolean;
    currentTrack: any;
    handlePause: () => void;
    handleResume: () => void;
    startDebugBroadcast: () => Promise<void>;
  };
}

export function StreamPlayer({ backgroundAudio }: StreamPlayerProps) {
  const { audioFiles, isLoading } = useRadio();
  
  // Use backgroundAudio if provided, otherwise return null (audio managed elsewhere)
  if (!backgroundAudio) {
    return null;
  }

  const { 
    isPlaying, 
    isUserPaused, 
    currentTrack, 
    handlePause, 
    handleResume, 
    startDebugBroadcast 
  } = backgroundAudio;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 p-6 sm:p-8 lg:p-10 text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative">
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Radio className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white/60" />
                </motion.div>
              </div>
            </div>
            
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white/70 text-sm sm:text-base lg:text-lg font-medium"
            >
              Tuning in...
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto text-center"
        >
          {/* Inactive Radio */}
          <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                <Radio className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
              </div>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 font-medium">OFFLINE</p>
          </div>
          
          <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-3 sm:mb-4">No Scheduled Broadcast</h3>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 px-4 max-w-md mx-auto leading-relaxed">
            The radio station is currently offline. Check back during scheduled broadcast times.
          </p>
          
          {/* Debug: Start broadcast button if audio files are available */}
          {audioFiles.length > 0 && (
            <button
              onClick={startDebugBroadcast}
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base lg:text-lg"
            >
              Start Test Broadcast
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Modern Radio Player Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
      >
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl">
          
          {/* Album Art Display */}
          <div className="relative mb-6 sm:mb-8 lg:mb-10">
            <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-accent-400 to-accent-600 relative">
              {currentTrack.coverImageUrl ? (
                <motion.img
                  key={currentTrack.fileId}
                  src={currentTrack.coverImageUrl}
                  alt="Album Art"
                  className="w-full h-full object-cover"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <Radio className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white/80" />
                  </motion.div>
                </div>
              )}
              
              {/* Playing Pulse Effect */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl border-4 border-white/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 truncate">
              {currentTrack.songName || currentTrack.fileName || 'Live Stream'}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-white/60 truncate">
              {currentTrack.artist || 'Marconi College Radio'}
            </p>
          </div>

          {/* Play/Pause Control */}
          <div className="flex justify-center">
            <motion.button
              onClick={isUserPaused || !isPlaying ? handleResume : handlePause}
              disabled={!currentTrack}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isUserPaused || !isPlaying ? (
                <Play className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white ml-1" />
              ) : (
                <Pause className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              )}
            </motion.button>
          </div>

          {/* Radio Branding */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <div className="text-xs sm:text-sm lg:text-base font-bold text-white/80 tracking-widest">MARCONI</div>
            <div className="text-xs sm:text-sm text-white/50">College Radio</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
