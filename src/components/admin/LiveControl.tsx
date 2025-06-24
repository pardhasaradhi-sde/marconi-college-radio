import { useState } from 'react';
import { Play, Pause, Square, Radio, Volume2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AdminAudioPlayer } from './AdminAudioPlayer';
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
        await radioService.playTrack(audioFiles[0]);
      } catch (error) {
        console.error('Failed to start playing:', error);
        alert('Failed to start playing. Please try again.');
      }
      setUpdating(false);
    } else if (currentTrack) {
      setUpdating(true);
      try {
        await radioService.resumeTrack();
      } catch (error) {
        console.error('Failed to resume:', error);
        alert('Failed to resume. Please try again.');
      }
      setUpdating(false);
    }
  };

  const handlePause = async () => {
    setUpdating(true);
    try {
      await radioService.pauseTrack();
    } catch (error) {
      console.error('Failed to pause:', error);
      alert('Failed to pause. Please try again.');
    }
    setUpdating(false);
  };

  const handleStop = async () => {
    setUpdating(true);
    try {
      await radioService.stopTrack();
    } catch (error) {
      console.error('Failed to stop:', error);
      alert('Failed to stop. Please try again.');
    }
    setUpdating(false);
  };

  const handleSelectTrack = async (audioFile: AudioFile) => {
    setUpdating(true);
    try {
      await radioService.playTrack(audioFile);
    } catch (error) {
      console.error('Failed to select track:', error);
      alert('Failed to select track. Please try again.');
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
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-accent-500 animate-pulse' : 'bg-white/40'}`}></div>
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
      <AdminAudioPlayer className="mb-6" />

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
              isPlaying ? 'bg-accent-400 animate-pulse' : 'bg-white/40'
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

        {audioFiles.length === 0 && (
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-white/60 text-sm text-center">
              No audio files available. Upload some files first to start broadcasting.
            </p>
          </div>
        )}
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

      {/* Track Selection */}
      {audioFiles.length > 0 && (
        <Card glass className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-heading font-semibold text-white mb-2">Track Library</h3>
            <p className="text-white/60 text-sm">Select a track to play live</p>
          </div>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {audioFiles.map((audioFile) => {
              const isCurrentTrack = currentTrack?.fileId === audioFile.fileId;
              
              return (
                <div
                  key={audioFile.$id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    isCurrentTrack
                      ? 'bg-accent-500/20 border-accent-500/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleSelectTrack(audioFile)}
                >
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

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {audioFile.songName || audioFile.fileName}
                    </h4>
                    <p className="text-white/60 text-sm truncate">
                      {audioFile.artist || 'Unknown Artist'}
                    </p>
                  </div>

                  {isCurrentTrack && (
                    <div className="flex items-center gap-2 text-accent-400">
                      <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        {isPlaying ? 'Playing' : 'Selected'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
