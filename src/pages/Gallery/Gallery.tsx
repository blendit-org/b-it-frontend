// App.tsx
import GalleryPage from "./GalleryPage";

const images = [
  {
    src: "https://cdn.pixabay.com/photo/2016/07/11/17/50/music-1510198_1280.jpg",
    name: "3D Model 1",
  },
  {
    src: "https://cdn.pixabay.com/photo/2014/02/03/16/51/football-257489_640.png",
    name: "3D Model 2",
  },
  {
    src: "https://example.com/3dmodel3.png",
    name: "3D Model 3",
  },
];

const Gallery = () => {
  return <GalleryPage images={images} />;
};

export default Gallery;
