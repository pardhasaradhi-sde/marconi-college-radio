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
          <p className="text-red-400 text-base sm:text-lg mb-4">{error}</p>
          <button
            onClick={fetchActiveAnnouncements}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="w-full max-w-none space-y-6 sm:space-y-8 pb-4">
        <div className="text-center px-4 lg:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3 sm:mb-4">
            📢 Event Announcements
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/60 font-body">Stay updated with campus events</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-12 border border-white/10 text-center mx-4 lg:mx-0">
          <Megaphone className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Announcements Yet</h3>
          <p className="text-white/60 text-sm sm:text-base">Check back later for exciting campus events and announcements!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 sm:space-y-8 pb-4">
      <div className="text-center px-4 lg:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3 sm:mb-4">
          📢 Event Announcements
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-body">Stay updated with campus events</p>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 px-4 lg:px-0">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedAnnouncement(announcement)}
            className="group cursor-pointer bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 overflow-hidden hover:border-white/30 hover:scale-105 transition-all duration-300"
          >
            {/* Event Image */}
            <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">
              {announcement.imageUrl ? (
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent-600 to-purple-600 flex items-center justify-center">
                  <Megaphone className="w-8 h-8 sm:w-12 sm:h-12 text-white/80" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Event Date Badge */}
              {announcement.eventDate && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue-600/90 backdrop-blur-sm rounded-md sm:rounded-lg px-2 sm:px-3 py-1">
                  <div className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium">
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
            <div className="p-3 sm:p-4 lg:p-5">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-accent-300 transition-colors">
                {announcement.title}
              </h3>
              
              <p className="text-white/60 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {announcement.content}
              </p>
              
              {announcement.eventDate && (
                <div className="flex items-center gap-1 text-blue-300 text-xs sm:text-sm mt-2 sm:mt-3">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
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
