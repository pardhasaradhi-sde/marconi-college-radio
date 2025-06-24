import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, Trash2, Play, Pause, Loader, Image, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Toast } from '../ui/Toast';
import { AdminAudioPlayer } from './AdminAudioPlayer';
import { useAuth } from '../../contexts/AuthContext';
import { useRadio } from '../../contexts/RadioContext';
import { audioService, radioService, AudioFile } from '../../services/appwrite';

export function UploadManager() {
  const { user } = useAuth();
  const { audioFiles, refreshAudioFiles, radioState } = useRadio();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedAudioFile(file);
        setShowUploadForm(true);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedAudioFile(file);
        setShowUploadForm(true);
      }
    }
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedCoverImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  const handleUpload = async () => {
    if (!user || !selectedAudioFile || !songName || !artist) return;
    
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await audioService.uploadAudio(
        selectedAudioFile, 
        user.email, 
        { songName, artist }, 
        selectedCoverImage || undefined
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset form
      setSelectedAudioFile(null);
      setSelectedCoverImage(null);
      setSongName('');
      setArtist('');
      setCoverPreview(null);
      setShowUploadForm(false);
      
      await refreshAudioFiles();
      
      // Show success toast
      setToast({ message: 'Song uploaded successfully!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setToast({ message: 'Upload failed. Please try again.', type: 'error' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePlay = async (audioFile: AudioFile) => {
    try {
      await radioService.playTrack(audioFile);
    } catch (error) {
      console.error('Play error:', error);
    }
  };

  const handlePause = async () => {
    try {
      await radioService.pauseTrack();
    } catch (error) {
      console.error('Pause error:', error);
    }
  };  const handleDelete = async (audioFile: AudioFile) => {
    const isCurrentlyPlaying = radioState?.currentTrack?.fileId === audioFile.fileId;
    
    const confirmMessage = isCurrentlyPlaying 
      ? `"${audioFile.songName || audioFile.fileName}" is currently playing. Deleting it will stop the broadcast. Are you sure?`
      : `Are you sure you want to delete "${audioFile.songName || audioFile.fileName}"? This action cannot be undone.`;
      
    if (!confirm(confirmMessage)) return;
    
    setDeletingFiles(prev => new Set(prev).add(audioFile.$id));
    
    try {
      // If this is the currently playing track, stop it first
      if (isCurrentlyPlaying) {
        await radioService.stopTrack();
      }
      
      await audioService.deleteAudio(audioFile.$id, audioFile.fileId);
      await refreshAudioFiles();
      
      setToast({ 
        message: `"${audioFile.songName || audioFile.fileName}" deleted successfully!`, 
        type: 'success' 
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error: any) {
      console.error('Delete error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to delete song. Please try again.';
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        errorMessage = 'Song not found. It may have already been deleted.';
        // Refresh the list to sync with the server state
        await refreshAudioFiles();
      } else if (error.message?.includes('permission')) {
        errorMessage = 'You do not have permission to delete this song.';
      }
      
      setToast({ message: errorMessage, type: 'error' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(audioFile.$id);
        return newSet;
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Music Upload & Library</h2>
        <p className="text-white/60 font-body">Manage your radio station's music collection</p>
      </div>

      {/* Admin Audio Player */}
      <AdminAudioPlayer className="sticky top-4 z-10" />

      {/* Upload Section */}
      <Card glass className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
            <Upload className="h-5 w-5 text-accent-400" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-white">Upload Music</h3>
            <p className="text-white/60 text-sm font-body">Add new songs to your radio library</p>
          </div>
        </div>
        
        {!showUploadForm ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-accent-500 bg-accent-500/10 scale-[1.02]'
                : 'border-white/20 hover:border-accent-400/50 hover:bg-white/5'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`transition-all duration-300 ${dragActive ? 'scale-110' : ''}`}>
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {dragActive ? 'Drop your audio file here' : 'Upload Audio File'}
              </h3>
              <p className="text-white/70 font-body mb-1">
                Drag and drop your audio file here, or click to browse
              </p>
              <p className="text-white/50 text-sm font-body mb-6">
                Supports MP3, WAV, OGG, M4A, AAC • Max 50MB
              </p>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="audio/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                variant="primary"
                className="pointer-events-none bg-accent-500 hover:bg-accent-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </div>        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center">
                  <Music className="h-4 w-4 text-accent-400" />
                </div>
                <h4 className="text-lg font-heading font-semibold text-white">Song Details</h4>
              </div>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedAudioFile(null);
                  setSelectedCoverImage(null);
                  setSongName('');
                  setArtist('');
                  setCoverPreview(null);
                }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cover Image Section */}
              <div className="space-y-4">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Cover Image
                </label>
                <div className="relative">
                  {coverPreview ? (
                    <div className="relative group">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full aspect-square object-cover rounded-xl border-2 border-white/10"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => {
                            setSelectedCoverImage(null);
                            setCoverPreview(null);
                          }}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-white/20 rounded-xl hover:border-accent-400/50 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="text-center p-6">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-500/20 transition-colors">
                          <Image className="h-6 w-6 text-white/40 group-hover:text-accent-400 transition-colors" />
                        </div>
                        <p className="text-white/60 text-sm font-medium mb-1">Add Cover Art</p>
                        <p className="text-white/40 text-xs">JPG, PNG up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleCoverImageSelect}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Song Details Section */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Song Name *
                    </label>
                    <Input
                      type="text"
                      value={songName}
                      onChange={(e) => setSongName(e.target.value)}
                      placeholder="Enter song name"
                      required
                      className="bg-white/5 border-white/20 focus:border-accent-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Artist *
                    </label>
                    <Input
                      type="text"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="Enter artist name"
                      required
                      className="bg-white/5 border-white/20 focus:border-accent-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Audio File
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center">
                      <Music className="h-4 w-4 text-accent-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {selectedAudioFile?.name}
                      </p>
                      <p className="text-white/60 text-xs">
                        {selectedAudioFile ? `${(selectedAudioFile.size / (1024 * 1024)).toFixed(1)} MB` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/80 font-medium">Uploading...</span>
                      <span className="text-accent-400 font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-accent-500 to-accent-400 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-xs">
                      Please don't close this window while uploading...
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleUpload}
                    variant="primary"
                    disabled={uploading || !songName || !artist}
                    className="flex-1 bg-accent-500 hover:bg-accent-600 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Song
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowUploadForm(false)}
                    variant="secondary"
                    className="px-6 bg-white/10 hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>      {/* Audio Files List */}
      <Card glass className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
            <Music className="h-5 w-5 text-accent-400" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-white">
              Music Library ({audioFiles.length})
            </h3>
            <p className="text-white/60 text-sm font-body">Your uploaded songs and tracks</p>
          </div>
        </div>        
        {audioFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="h-8 w-8 text-white/40" />
            </div>
            <h4 className="text-lg font-heading font-semibold text-white mb-2">No music yet</h4>
            <p className="text-white/60 font-body">Upload your first audio file to get started</p>
          </div>        ) : (
          <div className="space-y-3">
            {audioFiles.map((audioFile) => {
              const isDeleting = deletingFiles.has(audioFile.$id);
              const isCurrentlyPlaying = radioState?.currentTrack?.fileId === audioFile.fileId;
              
              return (
                <motion.div
                  key={audioFile.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isDeleting ? 0.5 : 1, y: 0 }}
                  className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 ${
                    isCurrentlyPlaying 
                      ? 'bg-gradient-to-r from-accent-500/20 to-purple-500/20 border-accent-500/40' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Cover Image */}
                  <div className="relative w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {audioFile.coverImageUrl ? (
                      <img
                        src={audioFile.coverImageUrl}
                        alt={audioFile.songName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="h-7 w-7 text-white/40" />
                    )}
                    {/* Live indicator for currently playing track */}
                    {isCurrentlyPlaying && radioState?.isPlaying && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-heading font-semibold text-lg truncate">
                      {audioFile.songName || audioFile.fileName}
                    </h4>
                    <p className="text-white/70 text-base font-body truncate">
                      {audioFile.artist || 'Unknown Artist'}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-white/50 text-sm font-body">
                        {formatDuration(audioFile.duration)}
                      </span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/50 text-sm font-body">
                        {new Date(audioFile.uploadedAt).toLocaleDateString()}
                      </span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/50 text-sm font-body">
                        {audioFile.fileName.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Now Playing Indicator */}
                  {isCurrentlyPlaying && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent-500/20 rounded-full border border-accent-500/40">
                      <div className={`w-2 h-2 rounded-full ${radioState?.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                      <span className={`text-sm font-body font-medium ${radioState?.isPlaying ? 'text-green-400' : 'text-yellow-400'}`}>
                        {radioState?.isPlaying ? 'Live' : 'Paused'}
                      </span>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => radioState?.currentTrack?.fileId === audioFile.fileId && radioState?.isPlaying
                        ? handlePause()
                        : handlePlay(audioFile)
                      }
                      variant="secondary"
                      size="sm"
                      disabled={isDeleting}
                      className="bg-white/10 hover:bg-white/20 border-white/20 disabled:opacity-50"
                    >
                      {radioState?.currentTrack?.fileId === audioFile.fileId && radioState?.isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDelete(audioFile)}
                      variant="secondary"
                      size="sm"
                      disabled={isDeleting}
                      className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
