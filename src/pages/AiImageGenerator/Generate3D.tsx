"use client";

import { Wand2, FileText } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Generate3D = () => {

  const navigate = useNavigate();
    
  const email = localStorage.getItem("email");
  useEffect(() => {
    if (!email) {
      navigate("/login");
      toast.error("You need to Login First");
    }
  }, [email]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-12 text-center">
        Welcome to 3D Generator
      </h1>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl">
        {/* Card 1: Text/Image to 3D */}
        <div
          onClick={() => navigate("/textimage3D")}
          className="flex-1 cursor-pointer border border-[#ff6600]/50 rounded-2xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 hover:shadow-lg"
        >
          <div className="p-4 rounded-full mb-4 border border-[#ff6600]">
            <Wand2 size={32} className="text-[#ff6600]" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2 text-center">
            Text-to-Image / Image-to-3D
          </h2>
          <p className="text-white/80 text-center">
            Generate amazing images from text or convert your image into a 3D model.
          </p>
        </div>

        {/* Card 2: Generate 3D File */}
        <div
          onClick={() => navigate("/blend")}
          className="flex-1 cursor-pointer border border-[#ff6600]/50 rounded-2xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 hover:shadow-lg"
        >
          <div className="p-4 rounded-full mb-4 border border-[#ff6600]">
            <FileText size={32} className="text-[#ff6600]" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2 text-center">
            Generate 3D File
          </h2>
          <p className="text-white/80 text-center">
            Create and download 3D files from your generated models for Blender or other 3D software.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Generate3D;
