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
      className="fixed bottom-32 md:bottom-4 left-4 right-4 md:left-[300px] md:right-4 z-40"
    >
      <div className="bg-black/80 backdrop-blur-lg rounded-2xl border border-white/20 p-4 shadow-2xl">
        <div className="flex items-center gap-4">
          {/* Album Art */}
          <div className="flex-shrink-0">
            {currentTrack.coverImageUrl ? (
              <img
                src={currentTrack.coverImageUrl}
                alt="Album Art"
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                <Radio className="h-6 w-6 text-white" />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {currentTrack.songName || currentTrack.fileName}
            </p>
            <p className="text-white/60 text-xs truncate">
              {currentTrack.artist || 'Marconi Radio'}
            </p>
          </div>

          {/* Play/Pause Button */}
          <motion.button
            onClick={isUserPaused || !isPlaying ? handleResume : handlePause}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUserPaused || !isPlaying ? (
              <Play className="h-5 w-5 ml-0.5" />
            ) : (
              <Pause className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
