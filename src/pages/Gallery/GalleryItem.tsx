import { MediaType, type MediaItem } from '@/types/gallery.type';
import React from 'react';
import VideoIcon from './VideoIcon';
import HeartIcon from './HeartIcon';

interface GalleryItemProps {
  item: MediaItem;
  onToggleSave: (id: string) => void;
  onSelectItem: (item: MediaItem) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ item, onToggleSave, onSelectItem }) => {
  const { id, type, url, title, description, isSaved } = item;
  
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when saving
    onToggleSave(id);
  };

  return (
    <div 
      className="group relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
      onClick={() => onSelectItem(item)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelectItem(item); }}
      role="button"
      tabIndex={0}
      aria-label={`View ${title}`}
    >
      <img src={url} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:blur-sm" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-lg font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{title}</h3>
        <p className="text-sm text-slate-300 mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{description}</p>
      </div>

      {/* Type Icon */}
      {type === MediaType.Video && (
        <div className="absolute top-3 left-3 bg-black/50 p-2 rounded-full backdrop-blur-sm">
          <VideoIcon className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSaveClick}
        className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-transform duration-200 ease-in-out hover:scale-110 active:scale-125 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label={isSaved ? 'Unsave item' : 'Save item'}
      >
        <HeartIcon isSaved={isSaved} />
      </button>
    </div>
  );
};

export default GalleryItem;