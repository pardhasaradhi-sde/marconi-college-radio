import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Play, X, Music } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useRadio } from '../../contexts/RadioContext';
import { AudioFile } from '../../services/appwrite';

interface ScheduledBroadcast {
  id: string;
  trackId: string;
  trackName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export function ScheduleManager() {
  const { radioState, audioFiles, scheduleRadio, cancelSchedule } = useRadio();
  const [scheduledBroadcasts, setScheduledBroadcasts] = useState<ScheduledBroadcast[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AudioFile | null>(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load scheduled broadcasts on mount
  useEffect(() => {
    loadScheduledBroadcasts();
  }, []);

  // Set default dates to today
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (!startDate) setStartDate(today);
    if (!endDate) setEndDate(today);
    if (!startTime) setStartTime(currentTime);
    if (!endTime) {
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setEndTime(oneHourLater.toTimeString().slice(0, 5));
    }
  }, [startDate, endDate, startTime, endTime]);

  const loadScheduledBroadcasts = async () => {
    try {
      // This would come from the database - for now we'll check current radio state
      const broadcasts: ScheduledBroadcast[] = [];
      
      if (radioState?.isScheduled && radioState.scheduledTrackId) {
        const track = audioFiles.find(f => f.$id === radioState.scheduledTrackId);
        if (track && radioState.scheduledStartTime && radioState.scheduledEndTime) {
          broadcasts.push({
            id: 'current',
            trackId: radioState.scheduledTrackId,
            trackName: track.songName || track.fileName,
            startTime: new Date(radioState.scheduledStartTime).toLocaleString(),
            endTime: new Date(radioState.scheduledEndTime).toLocaleString(),
            status: radioState.isPlaying ? 'active' : 'scheduled'
          });
        }
      }
      
      setScheduledBroadcasts(broadcasts);
    } catch (error) {
      console.error('Failed to load scheduled broadcasts:', error);
    }
  };

  const handleScheduleBroadcast = async () => {
    if (!selectedTrack || !startDate || !startTime || !endDate || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;
      
      await scheduleRadio(selectedTrack.$id, startDateTime, endDateTime);
      
      // Refresh the broadcasts list
      await loadScheduledBroadcasts();
      
      // Reset form and close modal
      setSelectedTrack(null);
      setShowModal(false);
      
      alert('Broadcast scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule broadcast:', error);
      alert('Failed to schedule broadcast. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBroadcast = async (_broadcastId: string) => {
    if (!confirm('Are you sure you want to cancel this scheduled broadcast?')) {
      return;
    }

    try {
      await cancelSchedule();
      await loadScheduledBroadcasts();
      alert('Broadcast cancelled successfully!');
    } catch (error) {
      console.error('Failed to cancel broadcast:', error);
      alert('Failed to cancel broadcast. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'active': return 'Live Now';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Schedule Manager</h2>
          <p className="text-white/60 font-body">Schedule radio broadcasts to play automatically at specific times</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
          Schedule Broadcast
        </Button>
      </div>

      {/* Current Status */}
      <Card glass className="p-6">
        <h3 className="text-xl font-heading font-semibold text-white mb-4">Current Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${radioState?.isPlaying ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-white font-medium">Radio Status</span>
            </div>
            <p className="text-white/60 text-sm">
              {radioState?.isPlaying ? 'Playing' : 'Stopped'}
            </p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${radioState?.isScheduled ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
              <span className="text-white font-medium">Scheduling</span>
            </div>
            <p className="text-white/60 text-sm">
              {radioState?.isScheduled ? 'Active' : 'None'}
            </p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-4 h-4 text-white" />
              <span className="text-white font-medium">Current Track</span>
            </div>
            <p className="text-white/60 text-sm">
              {radioState?.currentTrack?.songName || radioState?.currentTrack?.fileName || 'None'}
            </p>
          </div>
        </div>
      </Card>

      {/* Scheduled Broadcasts */}
      <Card glass className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-heading font-semibold text-white">Scheduled Broadcasts</h3>
          <Button variant="ghost" size="sm" onClick={loadScheduledBroadcasts}>
            Refresh
          </Button>
        </div>

        {scheduledBroadcasts.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-white/30 mb-4" />
            <p className="text-white/60 font-body">No scheduled broadcasts</p>
            <p className="text-white/40 text-sm">Click "Schedule Broadcast" to add one</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledBroadcasts.map((broadcast, index) => (
              <motion.div
                key={broadcast.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
              >
                <div className={`p-2 rounded-lg ${getStatusColor(broadcast.status)}`}>
                  <Play className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-heading font-semibold text-white">{broadcast.trackName}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(broadcast.status)} text-white`}>
                      {getStatusText(broadcast.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60 font-body">
                    <span>{broadcast.startTime} - {broadcast.endTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {broadcast.status === 'scheduled' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={Trash2}
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleCancelBroadcast(broadcast.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-900 rounded-2xl border border-white/20 p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-heading font-semibold text-white">Schedule Broadcast</h3>                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={X}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
            </div>

            <div className="space-y-4">
              {/* Track Selection */}
              <div>
                <label className="block text-white font-medium mb-2">Select Track</label>
                <select
                  value={selectedTrack?.$id || ''}
                  onChange={(e) => {
                    const track = audioFiles.find(f => f.$id === e.target.value);
                    setSelectedTrack(track || null);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Choose a track...</option>
                  {audioFiles.map((track) => (
                    <option key={track.$id} value={track.$id}>
                      {track.songName || track.fileName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">End Time</label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleScheduleBroadcast}
                  disabled={isLoading || !selectedTrack}
                >
                  {isLoading ? 'Scheduling...' : 'Schedule'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}