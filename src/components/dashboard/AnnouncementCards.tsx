import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { announcementService, type Announcement } from '../../services/appwrite';

export function AnnouncementCards() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveAnnouncements();
  }, []);

  const fetchActiveAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const activeAnnouncements = await announcementService.getAnnouncements(true); // true for activeOnly
      setAnnouncements(activeAnnouncements);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">📢 Event Announcements</h3>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">📢 Event Announcements</h3>
        <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return null; // Don't show the section if there are no announcements
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <h3 className="text-xl font-semibold text-white">📢 Event Announcements</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:border-white/30 transition-all duration-300 group"
          >
            {/* Event Image */}
            {announcement.imageUrl && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {announcement.eventDate && (
                  <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="flex items-center gap-1 text-white text-sm font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(announcement.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {announcement.title}
              </h4>
              
              <p className="text-white/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                {announcement.content}
              </p>

              {/* Event Details */}
              {announcement.eventDate && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-blue-300 text-sm">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {formatEventDate(announcement.eventDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
