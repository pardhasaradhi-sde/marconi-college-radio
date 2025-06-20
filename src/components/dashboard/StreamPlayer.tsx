import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Radio, Video, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useStream } from '../../contexts/StreamContext';

export function StreamPlayer() {
  const { currentStream, isPlaying, volume, setIsPlaying, setVolume } = useStream();
  const [isMuted, setIsMuted] = useState(false);
  const [reactions, setReactions] = useState({ hearts: 247, comments: 89, shares: 34 });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleReaction = (type: 'hearts' | 'comments' | 'shares') => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  if (!currentStream) {
    return (
      <Card glass className="p-8 text-center">
        <div className="text-white/60 mb-4">
          <Radio className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-body">No active stream</p>
          <p className="text-sm">Come back during college hours</p>
        </div>
      </Card>
    );
  }

  return (
    <Card glass className="p-6">
      <div className="space-y-6">
        {/* Stream Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentStream.type === 'video' ? 'bg-red-500' : 'bg-blue-500'}`}>
              {currentStream.type === 'video' ? <Video className="h-5 w-5 text-white" /> : <Radio className="h-5 w-5 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-white">{currentStream.title}</h3>
              <p className="text-white/60 text-sm font-body">Hosted by {currentStream.host}</p>
            </div>
          </div>
          {currentStream.isLive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-body">LIVE</span>
              <span className="text-white/60 text-sm font-body">• {currentStream.viewers} viewers</span>
            </div>
          )}
        </div>

        {/* Player */}
        <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
          {currentStream.type === 'video' ? (
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
              <Video className="h-12 w-12 text-white/40" />
              <span className="ml-3 text-white/60 font-body">Video Player</span>
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isPlaying ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isPlaying ? Infinity : 0,
                }}
                className="text-center"
              >
                <Radio className="h-12 w-12 text-white/60 mx-auto mb-2" />
                <div className="text-white/40 text-sm font-body">Audio Waveform</div>
              </motion.div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              size="sm"
              icon={isPlaying ? Pause : Play}
              onClick={handlePlayPause}
            />
            
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white/60 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-white/20 rounded-full outline-none slider"
              />
              <span className="text-white/60 text-sm font-body w-8">{isMuted ? 0 : volume}</span>
            </div>
            
            <div className="text-white/60 text-sm font-body">
              {currentStream.duration}
            </div>
          </div>
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleReaction('hearts')}
              className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors"
            >
              <Heart size={20} />
              <span className="text-sm font-body">{reactions.hearts}</span>
            </button>
            <button
              onClick={() => handleReaction('comments')}
              className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors"
            >
              <MessageCircle size={20} />
              <span className="text-sm font-body">{reactions.comments}</span>
            </button>
            <button
              onClick={() => handleReaction('shares')}
              className="flex items-center gap-2 text-white/60 hover:text-green-400 transition-colors"
            >
              <Share2 size={20} />
              <span className="text-sm font-body">{reactions.shares}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}