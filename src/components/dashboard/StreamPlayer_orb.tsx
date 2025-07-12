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
      <div className="mobile-radio-perfect-center">
        <div className="vintage-radio loading">
          <div className="radio-screen">
            <div className="loading-display">
              <div className="loading-vinyl">
                <motion.div
                  className="vinyl-disc loading-animation"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="vinyl-center">
                    <Radio className="h-4 w-4 text-white/60" />
                  </div>
                </motion.div>
              </div>
              <div className="loading-text">
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-white/70 text-sm"
                >
                  Tuning in...
                </motion.p>
              </div>
            </div>
          </div>
          <div className="radio-controls-centered">
            <div className="main-control-centered">
              <div className="play-pause-btn-centered disabled">
                <Radio className="h-6 w-6 text-white/40" />
              </div>
            </div>
          </div>
          <div className="radio-branding">
            <div className="brand-name">MARCONI</div>
            <div className="model-number">Loading...</div>
          </div>
          <div className="speaker-grille">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="grille-hole" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="mobile-radio-perfect-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Inactive Radio */}
          <div className="relative mb-8">
            <div className="vintage-radio offline">
              <div className="radio-screen">
                <Radio className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                <p className="text-xs sm:text-sm text-gray-400 mt-2">OFFLINE</p>
              </div>
              <div className="radio-controls-centered">
                <div className="main-control-centered">
                  <div className="play-pause-btn-centered disabled">
                    <Radio className="h-6 w-6 text-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No Scheduled Broadcast</h3>
          <p className="text-gray-400 text-base sm:text-lg mb-4 px-4">The radio station is currently offline. Check back during scheduled broadcast times.</p>
          
          {/* Debug: Start broadcast button if audio files are available */}
          {audioFiles.length > 0 && (
            <button
              onClick={startDebugBroadcast}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Start Test Broadcast
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mobile-radio-perfect-center">
      {/* Vintage Radio Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="vintage-radio active"
      >
        {/* Radio Screen/Display */}
        <div className="radio-screen">
          {/* Now Playing Info */}
          <div className="now-playing-display">
          {/* Large Centered Album Art - Full Display */}
          <div className="album-art-full-container">
            {currentTrack.coverImageUrl ? (
              <div className="album-art-full">
                <motion.img
                  key={currentTrack.fileId}
                  src={currentTrack.coverImageUrl}
                  alt="Album Art"
                  className="album-image-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="album-art-overlay-full">
                  {isPlaying && (
                    <motion.div
                      className="playing-pulse-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="pulse-ring-full"></div>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="default-album-art-full">
                <div className="vinyl-record-full">
                  <motion.div
                    className="vinyl-disc-full"
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="vinyl-center-full">
                      <Radio className="h-20 w-20 text-white/80" />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Radio Controls - Centered Play/Pause Only */}
        <div className="radio-controls-centered">
          {/* Play/Pause Button */}
          <div className="main-control-centered">
            <button
              onClick={isUserPaused || !isPlaying ? handleResume : handlePause}
              disabled={!currentTrack}
              className="play-pause-btn-centered touch-optimized"
            >
              {isUserPaused || !isPlaying ? (
                <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" />
              ) : (
                <Pause className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Radio Branding */}
        <div className="radio-branding">
          <div className="brand-name">MARCONI</div>
          <div className="model-number">College Radio</div>
        </div>

        {/* Speaker Grille */}
        <div className="speaker-grille">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="grille-hole" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
