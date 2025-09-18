import React, { useState, useEffect, useMemo } from 'react';
import { fetchMedia } from './MediaService';
import { FilterType, type MediaItem } from '@/types/gallery.type';
import Header from './Header';
import FilterControls from './FilterControl';
import Loader from './Loader';
import GalleryGrid from './GalleryGrid';
import MediaModal from './MediaModel';

const Gallery: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.All);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);


  useEffect(() => {
    const loadMedia = async () => {
      try {
        setIsLoading(true);
        const items = await fetchMedia();
        setMediaItems(items);
        setError(null);
      } catch (err) {
        setError('Failed to load media. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, []);

  const handleToggleSave = (id: string) => {
    setMediaItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item
      )
    );
  };

  const handleSelectItem = (item: MediaItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const filteredItems = useMemo(() => {
    switch (activeFilter) {
      case FilterType.Photos:
        return mediaItems.filter(item => item.type === 'PHOTO');
      case FilterType.Videos:
        return mediaItems.filter(item => item.type === 'VIDEO');
      case FilterType.Saved:
        return mediaItems.filter(item => item.isSaved);
      case FilterType.All:
      default:
        return mediaItems;
    }
  }, [mediaItems, activeFilter]);

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterControls activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-20 text-red-400 bg-slate-800 rounded-lg">
            <h2 className="text-2xl font-semibold">{error}</h2>
          </div>
        ) : (
          <GalleryGrid items={filteredItems} onToggleSave={handleToggleSave} onSelectItem={handleSelectItem} />
        )}
      </main>
      {selectedItem && <MediaModal item={selectedItem} onClose={handleCloseModal} />}
    </div>
  );
};

export default Gallery;