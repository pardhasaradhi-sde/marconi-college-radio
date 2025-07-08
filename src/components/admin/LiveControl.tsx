import { useState } from 'react';
import { Play, Pause, Square, Radio, Volume2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useRadio } from '../../contexts/RadioContext';
import { radioService, AudioFile } from '../../services/appwrite';

export function LiveControl() {
  const { radioState, audioFiles, isLoading } = useRadio();
  const [updating, setUpdating] = useState(false);

  const currentTrack = radioState?.currentTrack;
  const isPlaying = radioState?.isPlaying || false;

  const handlePlay = async () => {
    if (!currentTrack && audioFiles.length > 0) {
      setUpdating(true);
      try {
        await radioService.updateRadioState({
          currentTrack: audioFiles[0],
          isPlaying: true,
          currentTime: 0,
          broadcastStartTime: new Date().toISOString(),
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to start broadcast:', error);
        alert('Failed to start broadcast. Please try again.');
      }
      setUpdating(false);
    } else if (currentTrack) {
      setUpdating(true);
      try {
        // For time-based sync, we restart the broadcast to get a fresh start time
        await radioService.updateRadioState({
          currentTrack: currentTrack,
          isPlaying: true,
          currentTime: 0,
          broadcastStartTime: new Date().toISOString(),
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to resume broadcast:', error);
        alert('Failed to resume broadcast. Please try again.');
      }
      setUpdating(false);
    }
  };

  const handlePause = async () => {
    setUpdating(true);
    try {
      await radioService.updateRadioState({
        isPlaying: false,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to pause broadcast:', error);
      alert('Failed to pause broadcast. Please try again.');
    }
    setUpdating(false);
  };

  const handleStop = async () => {
    setUpdating(true);
    try {
      await radioService.updateRadioState({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        broadcastStartTime: null,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to stop broadcast:', error);
      alert('Failed to stop broadcast. Please try again.');
    }
    setUpdating(false);
  };

  const handleSelectTrack = async (audioFile: AudioFile) => {
    setUpdating(true);
    try {
      await radioService.updateRadioState({
        currentTrack: audioFile,
        isPlaying: true,
        currentTime: 0,
        broadcastStartTime: new Date().toISOString(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to start broadcast with selected track:', error);
      alert('Failed to start broadcast with selected track. Please try again.');
    }
    setUpdating(false);
  };

  if (isLoading) {
    return (
      <Card glass className="p-8 text-center">
        <div className="text-white/60 mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-lg font-body">Loading controls...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-accent-500' : 'bg-white/40'}`}></div>
          <span className={`font-medium text-sm uppercase tracking-wider ${isPlaying ? 'text-accent-400' : 'text-white/60'}`}>
            {isPlaying ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 leading-tight">
          Live Control
        </h2>
        <p className="text-white/60 font-body max-w-2xl">
          Manage your live radio broadcast
        </p>
      </div>

      {/* Admin Audio Player */}
      {/* Note: AdminAudioPlayer component not available */}

      {/* Current Status & Controls */}
      <Card glass className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              isPlaying 
                ? 'bg-accent-500/20 border border-accent-500/30' 
                : 'bg-white/5 border border-white/10'
            }`}>
              <Radio className={`h-6 w-6 ${isPlaying ? 'text-accent-400' : 'text-white/40'}`} />
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-white mb-1">
                Broadcast Status
              </h3>
              <p className="text-white/60">
                {currentTrack ? `${currentTrack.songName || currentTrack.fileName}` : 'No track selected'}
              </p>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isPlaying 
              ? 'bg-accent-500/20 border border-accent-500/30 text-accent-400' 
              : 'bg-white/5 border border-white/10 text-white/60'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isPlaying ? 'bg-accent-400' : 'bg-white/40'
            }`}></div>
            <span className="text-sm font-medium">
              {isPlaying ? 'ON AIR' : 'OFF AIR'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          {!isPlaying ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handlePlay}
              disabled={updating || audioFiles.length === 0}
              className="px-6 py-3"
            >
              <Play className="h-5 w-5 mr-2" />
              {updating ? 'Starting...' : 'Start Radio'}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePause}
              disabled={updating}
              className="px-6 py-3"
            >
              <Pause className="h-5 w-5 mr-2" />
              {updating ? 'Pausing...' : 'Pause'}
            </Button>
          )}
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleStop}
            disabled={updating || !currentTrack}
            className="px-6 py-3"
          >
            <Square className="h-5 w-5 mr-2" />
            {updating ? 'Stopping...' : 'Stop'}
          </Button>
        </div>
      </Card>

      {/* Current Track Info */}
      {currentTrack && (
        <Card glass className="p-6">
          <h3 className="text-lg font-heading font-semibold text-white mb-4">Now Playing</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
              {currentTrack.coverImageUrl ? (
                <img
                  src={currentTrack.coverImageUrl}
                  alt={currentTrack.songName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Volume2 className="h-6 w-6 text-white/40" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-heading font-semibold text-white mb-1">
                {currentTrack.songName || currentTrack.fileName}
              </h4>
              <p className="text-white/70 mb-2">
                {currentTrack.artist || 'Unknown Artist'}
              </p>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <span>{currentTrack.fileName.split('.').pop()?.toUpperCase()}</span>
                <span>•</span>
                <span>ID: {currentTrack.fileId.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Track Selection - Made more prominent */}
      <Card glass className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-heading font-semibold text-white mb-2 flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-accent-400" />
            Audio Library
          </h3>
          <p className="text-white/60">Click any track to play it live on the radio station</p>
        </div>
        
        {audioFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Volume2 className="h-8 w-8 text-white/40" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No Audio Files</h4>
            <p className="text-white/60 text-sm mb-4">Upload some audio files to start broadcasting</p>
            <Button variant="primary" size="sm">
              Go to Upload Manager
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {audioFiles.map((audioFile, index) => {
              const isCurrentTrack = currentTrack?.fileId === audioFile.fileId;
              
              return (
                <div
                  key={audioFile.$id}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    isCurrentTrack
                      ? 'bg-accent-500/20 border-accent-500/40 shadow-lg shadow-accent-500/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onClick={() => handleSelectTrack(audioFile)}
                >
                  {/* Track Number & Artwork */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                      isCurrentTrack ? 'bg-accent-500/30 text-accent-200' : 'bg-white/10 text-white/60'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                      {audioFile.coverImageUrl ? (
                        <img
                          src={audioFile.coverImageUrl}
                          alt={audioFile.songName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Volume2 className="h-5 w-5 text-white/40" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate ${
                      isCurrentTrack ? 'text-white' : 'text-white group-hover:text-white'
                    }`}>
                      {audioFile.songName || audioFile.fileName}
                    </h4>
                    <p className={`text-sm truncate ${
                      isCurrentTrack ? 'text-accent-200' : 'text-white/60 group-hover:text-white/80'
                    }`}>
                      {audioFile.artist || 'Unknown Artist'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40 uppercase">
                        {audioFile.fileName.split('.').pop()}
                      </span>
                      <span className="text-xs text-white/30">•</span>
                      <span className="text-xs text-white/40">
                        {new Date(audioFile.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-3">
                    {isCurrentTrack && (
                      <div className="flex items-center gap-2 text-accent-400">
                        <div className={`w-2 h-2 rounded-full ${
                          isPlaying ? 'bg-accent-500' : 'bg-accent-500/60'
                        }`}></div>
                        <span className="text-sm font-medium">
                          {isPlaying ? 'Playing' : 'Selected'}
                        </span>
                      </div>
                    )}
                    
                    {!isCurrentTrack && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={updating}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
