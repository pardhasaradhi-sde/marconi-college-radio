import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Radio, Video, Activity, Copy, Eye, Settings } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function LiveControl() {
  const [audioLive, setAudioLive] = useState(true);
  const [videoLive, setVideoLive] = useState(false);
  const [streamHealth, setStreamHealth] = useState({ audio: 95, video: 0 });

  const obsConfig = {
    streamKey: 'sk_live_abc123def456ghi789',
    serverUrl: 'rtmp://live.marconi.anurag.edu.in/live',
    audioUrl: 'http://stream.marconi.anurag.edu.in:8000/audio.mp3',
    videoUrl: 'https://stream.marconi.anurag.edu.in/live'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Live Control Panel</h2>
        <p className="text-white/60 font-body">Manage your live streams and broadcasting</p>
      </div>

      {/* Stream Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Radio className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white">Audio Stream</h3>
                <p className="text-white/60 text-sm font-body">Live Radio Broadcast</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${audioLive ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${audioLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-body">{audioLive ? 'LIVE' : 'OFFLINE'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-body mb-1">
                <span className="text-white/60">Stream Health</span>
                <span className="text-white">{streamHealth.audio}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all"
                  style={{ width: `${streamHealth.audio}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={audioLive ? "danger" : "primary"}
                size="sm"
                icon={audioLive ? Square : Play}
                onClick={() => setAudioLive(!audioLive)}
                className="flex-1"
              >
                {audioLive ? 'Stop Audio' : 'Start Audio'}
              </Button>
              <Button variant="ghost" size="sm" icon={Settings}>
                Settings
              </Button>
            </div>
          </div>
        </Card>

        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white">Video Stream</h3>
                <p className="text-white/60 text-sm font-body">Live Video Broadcast</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${videoLive ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${videoLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-body">{videoLive ? 'LIVE' : 'OFFLINE'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-body mb-1">
                <span className="text-white/60">Stream Health</span>
                <span className="text-white">{streamHealth.video}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full transition-all"
                  style={{ width: `${streamHealth.video}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={videoLive ? "danger" : "primary"}
                size="sm"
                icon={videoLive ? Square : Play}
                onClick={() => setVideoLive(!videoLive)}
                className="flex-1"
              >
                {videoLive ? 'Stop Video' : 'Start Video'}
              </Button>
              <Button variant="ghost" size="sm" icon={Settings}>
                Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* OBS Configuration */}
      <Card glass className="p-6">
        <h3 className="text-xl font-heading font-semibold text-white mb-4">OBS Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm font-body mb-2">Stream Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-white/5 rounded-lg font-mono text-white text-sm">
                  {obsConfig.streamKey}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={Copy}
                  onClick={() => copyToClipboard(obsConfig.streamKey)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm font-body mb-2">Server URL</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-white/5 rounded-lg font-mono text-white text-sm">
                  {obsConfig.serverUrl}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={Copy}
                  onClick={() => copyToClipboard(obsConfig.serverUrl)}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm font-body mb-2">Audio Stream URL</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-white/5 rounded-lg font-mono text-white text-sm">
                  {obsConfig.audioUrl}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={Copy}
                  onClick={() => copyToClipboard(obsConfig.audioUrl)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm font-body mb-2">Video Stream URL</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-white/5 rounded-lg font-mono text-white text-sm">
                  {obsConfig.videoUrl}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={Copy}
                  onClick={() => copyToClipboard(obsConfig.videoUrl)}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Live Stats */}
      <Card glass className="p-6">
        <h3 className="text-xl font-heading font-semibold text-white mb-4">Live Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-full mx-auto mb-3">
              <Eye className="h-6 w-6 text-accent-400" />
            </div>
            <p className="text-2xl font-heading font-bold text-white">247</p>
            <p className="text-white/60 text-sm font-body">Live Viewers</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3">
              <Activity className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-2xl font-heading font-bold text-white">98%</p>
            <p className="text-white/60 text-sm font-body">Uptime</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3">
              <Radio className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-2xl font-heading font-bold text-white">320kbps</p>
            <p className="text-white/60 text-sm font-body">Bitrate</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-3">
              <Video className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-2xl font-heading font-bold text-white">1080p</p>
            <p className="text-white/60 text-sm font-body">Quality</p>
          </div>
        </div>
      </Card>
    </div>
  );
}