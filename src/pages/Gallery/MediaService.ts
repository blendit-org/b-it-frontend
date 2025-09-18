import { MediaType, type MediaItem } from "@/types/gallery.type";



const mockData: MediaItem[] = [
  {
    id: '1',
    type: MediaType.Photo,
    url: 'https://picsum.photos/seed/picsum1/800/600',
    title: 'Mountain Sunrise',
    description: 'A beautiful sunrise over the mountains.',
    isSaved: false,
  },
  {
    id: '2',
    type: MediaType.Video,
    url: 'https://picsum.photos/seed/vid1/800/600',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Big Buck Bunny',
    description: 'A classic short animation film.',
    isSaved: true,
  },
  {
    id: '3',
    type: MediaType.Photo,
    url: 'https://picsum.photos/seed/picsum2/800/600',
    title: 'City at Night',
    description: 'The bustling city lights after dark.',
    isSaved: false,
  },
  {
    id: '4',
    type: MediaType.Photo,
    url: 'https://picsum.photos/seed/picsum3/800/600',
    title: 'Forest Path',
    description: 'A tranquil path through a lush green forest.',
    isSaved: true,
  },
  {
    id: '5',
    type: MediaType.Video,
    url: 'https://picsum.photos/seed/vid2/800/600',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Elephants Dream',
    description: 'Another beautiful open-source animation.',
    isSaved: false,
  },
  {
    id: '6',
    type: MediaType.Photo,
    url: 'https://picsum.photos/seed/picsum4/800/600',
    title: 'Ocean Waves',
    description: 'Crashing waves on a sandy beach.',
    isSaved: false,
  },
    {
    id: '7',
    type: MediaType.Photo,
    url: 'https://picsum.photos/seed/picsum5/800/600',
    title: 'Desert Dunes',
    description: 'Golden sand dunes under a clear blue sky.',
    isSaved: false,
  },
  {
    id: '8',
    type: MediaType.Photo,
    url: 'https://picsum.photos/seed/picsum6/800/600',
    title: 'Winter Wonderland',
    description: 'A snowy landscape with pine trees.',
    isSaved: true,
  },
];

export const fetchMedia = (): Promise<MediaItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }); // Simulate network delay
  });
};
