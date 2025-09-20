import React from "react";
import { Download } from "lucide-react";

type GalleryProps = {
  images: { src: string; name: string }[];
};

const GalleryPage: React.FC<GalleryProps> = ({ images }) => {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">3D Image Gallery</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="group relative rounded-2xl shadow-lg overflow-hidden border border-neutral-200 hover:shadow-xl transition"
          >
            <img
              src={img.src}
              alt={img.name}
              className="w-full h-64 object-cover"
            />

            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition p-4">
              <span className="text-white font-medium">{img.name}</span>
              <button
                onClick={() => handleDownload(img.src, img.name)}
                className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
