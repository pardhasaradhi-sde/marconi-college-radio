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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
            className="relative bg-gradient-to-br from-primary-900 to-accent-900 rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image */}
            {announcement.imageUrl && (
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight">
                {announcement.title}
              </h2>

              {announcement.eventDate && (
                <div className="flex items-center gap-2 sm:gap-3 text-blue-300 mb-4 sm:mb-6">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    {formatEventDate(announcement.eventDate)}
                  </span>
                </div>
              )}

              <div className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm sm:text-base lg:text-lg">
                {announcement.content}
              </div>

              <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
                <button
                  onClick={onClose}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
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
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3 sm:mb-4">
            📢 Event Announcements
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/60 font-body">Stay updated with campus events</p>
        </div>
        
        <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3 sm:mb-4">
            📢 Event Announcements
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/60 font-body">Stay updated with campus events</p>
        </div>
        
        <div className="bg-red-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-red-500/20 text-center mx-4">
          <p className="text-red-300 font-medium">{error}</p>
          <button
            onClick={fetchActiveAnnouncements}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3 sm:mb-4">
            📢 Event Announcements
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/60 font-body">Stay updated with campus events</p>
        </div>
        
        <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
          <Megaphone className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-accent-400/50" />
          <h3 className="mt-4 text-lg sm:text-xl font-medium text-white">No active announcements</h3>
          <p className="text-white/60 mt-1 text-sm sm:text-base">Check back later for new events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3 sm:mb-4">
          📢 Event Announcements
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-body">Stay updated with campus events</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedAnnouncement(announcement)}
            className="relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group"
          >
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {announcement.eventDate && (
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(announcement.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight transition-transform duration-300 ease-in-out group-hover:-translate-y-1">
                {announcement.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnnouncementModal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement!}
      />
    </div>
  );
}
