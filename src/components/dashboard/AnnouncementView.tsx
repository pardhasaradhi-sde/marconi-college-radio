import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, Megaphone } from 'lucide-react';
import { announcementService, type Announcement } from '../../services/appwrite';

interface AnnouncementModalProps {
  announcement: Announcement;
  isOpen: boolean;
  onClose: () => void;
}

function AnnouncementModal({ announcement, isOpen, onClose }: AnnouncementModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gradient-to-br from-primary-900 to-accent-900 rounded-2xl border border-white/20 overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image */}
            {announcement.imageUrl && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {announcement.title}
              </h2>

              {announcement.eventDate && (
                <div className="flex items-center gap-2 text-blue-300 mb-6">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {formatEventDate(announcement.eventDate)}
                  </span>
                </div>
              )}

              <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                {announcement.content}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function AnnouncementView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetchActiveAnnouncements();
  }, []);

  const fetchActiveAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const activeAnnouncements = await announcementService.getAnnouncements(true);
      setAnnouncements(activeAnnouncements);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            📢 Event Announcements
          </h1>
          <p className="text-xl text-white/60 font-body">Stay updated with campus events</p>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            📢 Event Announcements
          </h1>
          <p className="text-xl text-white/60 font-body">Stay updated with campus events</p>
        </div>
        
        <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-8 border border-red-500/20 text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={fetchActiveAnnouncements}
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            📢 Event Announcements
          </h1>
          <p className="text-xl text-white/60 font-body">Stay updated with campus events</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
          <Megaphone className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Announcements Yet</h3>
          <p className="text-white/60">Check back later for exciting campus events and announcements!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
          📢 Event Announcements
        </h1>
        <p className="text-xl text-white/60 font-body">Stay updated with campus events</p>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedAnnouncement(announcement)}
            className="group cursor-pointer bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:border-white/30 hover:scale-105 transition-all duration-300"
          >
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden">
              {announcement.imageUrl ? (
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent-600 to-purple-600 flex items-center justify-center">
                  <Megaphone className="w-12 h-12 text-white/80" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Event Date Badge */}
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

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-accent-300 transition-colors">
                {announcement.title}
              </h3>
              
              <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
                {announcement.content}
              </p>
              
              {announcement.eventDate && (
                <div className="flex items-center gap-1 text-blue-300 text-xs mt-3">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(announcement.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnnouncementModal
        announcement={selectedAnnouncement!}
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </div>
  );
}
