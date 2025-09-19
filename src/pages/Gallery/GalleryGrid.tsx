import React from 'react';
import GalleryItem from './GalleryItem';
import type { MediaItem } from '@/types/gallery.type';

interface GalleryGridProps {
  items: MediaItem[];
  onToggleSave: (id: string) => void;
  onSelectItem: (item: MediaItem) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onToggleSave, onSelectItem }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 rounded-lg">
        <h2 className="text-2xl font-semibold text-slate-400">No items found.</h2>
        <p className="text-slate-500 mt-2">Try changing your filter or saving some items!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {items.map((item) => (
        <GalleryItem key={item.id} item={item} onToggleSave={onToggleSave} onSelectItem={onSelectItem} />
      ))}
    </div>
  );
};

export default GalleryGrid;