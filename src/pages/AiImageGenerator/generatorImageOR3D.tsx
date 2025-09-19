"use client";
import { useState, Suspense, type ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Wand2, Image as ImageIcon, Download } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

const GeneratorComponent = () => {
  type Mode = "textToImage" | "imageTo3d";
  const [mode, setMode] = useState<Mode>("textToImage");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prompt, setPrompt] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | null>(null);

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);


   const navigate = useNavigate();
  
    const email = localStorage.getItem("email");
          useEffect(() => {
            if (!email) {
              navigate("/login");
              toast.error("You need to Login First");
            }
          }, [email]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInputFile(e.target.files[0]);
      setMode("imageTo3d");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedImageUrl(null);
    setGeneratedModelUrl(null);

    try {
      if (mode === "textToImage") {
        await generateImage();
      } else {
        await generate3DModel();
      }
    } catch (err) {
      setError("Unexpected error. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    const res = await fetch("http://localhost:8000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      setError("Failed to generate image.");
      return;
    }
    const blob = await res.blob();
    const file = new File([blob], "generated-image.webp", { type: "image/webp" });
    setInputFile(file);
    setGeneratedImageUrl(URL.createObjectURL(blob));

    // clear input after success
    setPrompt("");
  };

  const generate3DModel = async () => {
    if (!inputFile) {
      setError("Please select an image file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", inputFile);
    const res = await fetch("http://localhost:8000/generate3d", { method: "POST", body: formData });
    if (!res.ok) {
      setError("Failed to generate 3D model.");
      return;
    }
    const blob = await res.blob();
    setGeneratedModelUrl(URL.createObjectURL(blob));
  };

  const handleDownload = async (url: string, filename: string) => {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Download failed.");
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const isGenerateDisabled =
    loading || (mode === "textToImage" && !prompt.trim()) || (mode === "imageTo3d" && !inputFile);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 text-orange-600">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-orange-300 p-6"
      >
        {/* Mode Switch */}
        <div className="flex rounded-xl border border-orange-300 overflow-hidden mb-6">
          <button
            onClick={() => setMode("textToImage")}
            className={`w-1/2 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === "textToImage"
                ? "bg-orange-500 text-white"
                : "text-orange-500 hover:bg-orange-100"
            }`}
          >
            <Wand2 size={16} /> Text-to-Image
          </button>
          <button
            onClick={() => setMode("imageTo3d")}
            className={`w-1/2 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === "imageTo3d"
                ? "bg-orange-500 text-white"
                : "text-orange-500 hover:bg-orange-100"
            }`}
          >
            <ImageIcon size={16} /> Image-to-3D
          </button>
        </div>

        {/* Input */}
        {mode === "textToImage" ? (
          <textarea
            className="w-full p-3 rounded-xl border border-orange-300 placeholder-orange-300 focus:outline-none focus:border-orange-500 resize-none text-white"
            rows={2}
            placeholder="Describe your 3D object..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        ) : (
          <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer w-full sm:w-auto p-4 rounded-xl text-center border border-orange-300 hover:border-orange-500 transition"
            >
              {inputFile ? `Selected: ${inputFile.name}` : "Click to upload image"}
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Generate */}
        <div className="flex justify-center sm:justify-end mt-6">
          <motion.button
            whileHover={!isGenerateDisabled ? { scale: 1.05 } : {}}
            whileTap={!isGenerateDisabled ? { scale: 0.95 } : {}}
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
              isGenerateDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Generate"
            )}
          </motion.button>
        </div>

        {error && <p className="text-center mt-4 text-red-500">{error}</p>}

        {/* Generated Image */}
        {generatedImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center"
          >
            <img
              src={generatedImageUrl}
              alt="Generated"
              className="w-full max-w-md mx-auto rounded-xl border border-orange-300"
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <button
                onClick={() => setMode("imageTo3d")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Use for 3D
              </button>
              <button
                onClick={() => handleDownload(generatedImageUrl, "generated_image.webp")}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition justify-center"
              >
                {downloading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Download size={16} /> Download
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Generated 3D Model */}
        {generatedModelUrl && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="w-full h-[50vh] sm:h-[60vh] rounded-xl border border-orange-300 overflow-hidden">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} />
                <Suspense fallback={null}>
                  <Model url={generatedModelUrl} />
                </Suspense>
                <OrbitControls />
              </Canvas>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => handleDownload(generatedModelUrl, "generated_model.glb")}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition justify-center"
              >
                {downloading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Download size={16} /> Download 3D Model
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default GeneratorComponent;
