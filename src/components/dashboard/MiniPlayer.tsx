import { motion } from 'framer-motion';
import { Radio, Play, Pause } from 'lucide-react';

interface MiniPlayerProps {
  backgroundAudio: {
    isPlaying: boolean;
    isUserPaused: boolean;
    currentTrack: any;
    handlePause: () => void;
    handleResume: () => void;
  };
}

export function MiniPlayer({ backgroundAudio }: MiniPlayerProps) {
  const { isPlaying, isUserPaused, currentTrack, handlePause, handleResume } = backgroundAudio;

  if (!currentTrack) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full"
    >
      <div className="bg-black/80 backdrop-blur-lg rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 p-3 sm:p-4 shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Album Art */}
          <div className="flex-shrink-0">
            {currentTrack.coverImageUrl ? (
              <img
                src={currentTrack.coverImageUrl}
                alt="Album Art"
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-md sm:rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-md sm:rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                <Radio className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base truncate">
              {currentTrack.songName || currentTrack.fileName}
            </p>
            <p className="text-white/60 text-xs sm:text-sm truncate">
              {currentTrack.artist || 'Marconi Radio'}
            </p>
          </div>

          {/* Play/Pause Button */}
          <motion.button
            onClick={isUserPaused || !isPlaying ? handleResume : handlePause}
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUserPaused || !isPlaying ? (
              <Play className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ml-0.5" />
            ) : (
              <Pause className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
