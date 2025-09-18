import { MediaType, type MediaItem } from '@/types/gallery.type';
import React, { useEffect } from 'react';

interface MediaModalProps {
  item: MediaItem;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ item, onClose }) => {
  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-title"
    >
      <div
        className="bg-slate-900 rounded-lg shadow-2xl shadow-orange-500/20 w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <h2 id="media-title" className="text-xl font-bold text-orange-400">{item.title}</h2>
          <p className="text-sm text-slate-400 mt-1">{item.description}</p>
        </div>
        
        <div className="flex-1 p-2 md:p-4 min-h-0 flex justify-center items-center">
          {item.type === MediaType.Video ? (
            <video
              src={item.videoUrl}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={item.url}
              alt={item.title}
              className="max-w-full max-h-full object-contain rounded-md"
            />
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-orange-600 text-white rounded-full p-2 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white transition-transform duration-200 ease-in-out hover:scale-110"
          aria-label="Close media view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MediaModal;