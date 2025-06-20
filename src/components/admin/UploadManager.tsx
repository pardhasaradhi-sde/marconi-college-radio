import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Music, Video, Trash2, Play } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface UploadedFile {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'ad';
  size: string;
  duration: string;
  uploadDate: string;
  lastUsed?: string;
}

export function UploadManager() {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'Morning_Campus_Vibes.mp3',
      type: 'audio',
      size: '45.2 MB',
      duration: '2:34:12',
      uploadDate: '2024-01-15',
      lastUsed: '2024-01-20'
    },
    {
      id: '2',
      name: 'Tech_Talk_Tuesday.mp4',
      type: 'video',
      size: '234.5 MB',
      duration: '1:15:30',
      uploadDate: '2024-01-14',
      lastUsed: '2024-01-19'
    },
    {
      id: '3',
      name: 'Study_Session_Beats.mp3',
      type: 'audio',
      size: '67.8 MB',
      duration: '3:12:45',
      uploadDate: '2024-01-13'
    }
  ]);

  const [dragActive, setDragActive] = useState(false);

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
    // Handle file upload logic here
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-400';
      case 'audio': return 'text-blue-400';
      case 'ad': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Upload Manager</h2>
        <p className="text-white/60 font-body">Manage your audio and video content</p>
      </div>

      {/* Upload Area */}
      <Card glass className="p-8">
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive 
              ? 'border-accent-400 bg-accent-500/10' 
              : 'border-white/20 hover:border-white/40'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold text-white mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-white/60 font-body mb-4">
            Support for MP3, MP4, WAV files up to 500MB
          </p>
          <Button variant="primary">Choose Files</Button>
        </div>
      </Card>

      {/* File List */}
      <Card glass className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-heading font-semibold text-white">Uploaded Files</h3>
          <div className="flex items-center gap-2 text-white/60 text-sm font-body">
            <span>{files.length} files</span>
            <span>•</span>
            <span>Total: {files.reduce((acc, file) => acc + parseFloat(file.size), 0).toFixed(1)} MB</span>
          </div>
        </div>

        <div className="space-y-3">
          {files.map((file, index) => {
            const IconComponent = getFileIcon(file.type);
            
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
              >
                <div className={`p-2 rounded-lg bg-white/10 ${getTypeColor(file.type)}`}>
                  <IconComponent size={20} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-body font-semibold text-white">{file.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-white/60 font-body">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.duration}</span>
                    <span>•</span>
                    <span>Uploaded {file.uploadDate}</span>
                    {file.lastUsed && (
                      <>
                        <span>•</span>
                        <span>Last used {file.lastUsed}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={Play}>
                    Preview
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Trash2}
                    onClick={() => deleteFile(file.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {files.length === 0 && (
          <div className="text-center py-8">
            <File className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 font-body">No files uploaded yet. Start by uploading your first file.</p>
          </div>
        )}
      </Card>
    </div>
  );
}