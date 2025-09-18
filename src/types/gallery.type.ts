
export type MediaType = 'PHOTO' | 'VIDEO';

export const MediaType = {
  Photo: 'PHOTO' as MediaType,
  Video: 'VIDEO' as MediaType,
};


export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  videoUrl?: string;
  title: string;
  description: string;
  isSaved: boolean;
}

export const FilterType = {
  All: 'ALL',
  Photos: 'PHOTOS',
  Videos: 'VIDEOS',
  Saved: 'SAVED',
} as const;

export type FilterType = typeof FilterType[keyof typeof FilterType];



