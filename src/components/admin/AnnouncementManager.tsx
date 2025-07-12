import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Image, Trash2, Edit, Eye, EyeOff, Save, X } from 'lucide-react';
import { announcementService, Announcement } from '../../services/appwrite';
import { useAuth } from '../../contexts/AuthContext';

export function AnnouncementManager() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    eventDate: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load announcements
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', eventDate: '' });
    setSelectedImage(null);
    setImagePreview(null);
    setShowCreateForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update existing announcement
        await announcementService.updateAnnouncement(editingId, {
          title: formData.title.trim(),
          content: formData.content.trim(),
          eventDate: formData.eventDate || null
        });
      } else {
        // Create new announcement
        await announcementService.createAnnouncement(
          formData.title.trim(),
          formData.content.trim(),
          user.id,
          formData.eventDate || undefined,
          selectedImage || undefined
        );
      }
      
      await loadAnnouncements();
      resetForm();
    } catch (error) {
      console.error('Failed to save announcement:', error);
      alert('Failed to save announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      eventDate: announcement.eventDate || ''
    });
    setEditingId(announcement.$id);
    setShowCreateForm(true);
  };

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      await announcementService.updateAnnouncement(announcement.$id, {
        isActive: !announcement.isActive
      });
      await loadAnnouncements();
    } catch (error) {
      console.error('Failed to toggle announcement:', error);
    }
  };

  const handleDelete = async (announcement: Announcement) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await announcementService.deleteAnnouncement(announcement.$id, announcement.imageId);
      await loadAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      alert('Failed to delete announcement. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Announcements</h2>
          <p className="text-white/60">Manage events and announcements for your listeners</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>
            <button
              onClick={resetForm}
              className="text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-500"
                placeholder="Enter announcement title..."
                required
              />
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent-500 resize-none"
                placeholder="Enter announcement details..."
                required
              />
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-2">Event Date (Optional)</label>
              <input
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent-500"
              />
            </div>

            {!editingId && (
              <div>
                <label className="block text-white/80 font-medium mb-2">Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:bg-white/20 cursor-pointer transition-colors"
                  >
                    <Image className="h-4 w-4" />
                    Choose Image
                  </label>
                  {selectedImage && (
                    <span className="text-white/60 text-sm">{selectedImage.name}</span>
                  )}
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Announcements List */}
      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Announcements Yet</h3>
            <p className="text-white/60">Create your first announcement to engage with your listeners.</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <motion.div
              key={announcement.$id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border ${
                announcement.isActive ? 'border-white/20' : 'border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                {announcement.imageUrl && (
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {announcement.title}
                    </h3>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(announcement)}
                        className={`p-1 rounded ${
                          announcement.isActive ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'
                        }`}
                        title={announcement.isActive ? 'Hide announcement' : 'Show announcement'}
                      >
                        {announcement.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                        title="Edit announcement"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Delete announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/80 mb-3">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    {announcement.eventDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(announcement.eventDate).toLocaleString()}</span>
                      </div>
                    )}
                    <span>Created {new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
