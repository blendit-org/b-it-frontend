"use client";
import { useState, Suspense, type ChangeEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Wand2, Image as ImageIcon, Download } from "lucide-react";

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
    const res = await fetch("http://localhost:5000/generate-image", {
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
  };

  const generate3DModel = async () => {
    if (!inputFile) {
      setError("Please select an image file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", inputFile);
    const res = await fetch("http://localhost:5000/generate3d", { method: "POST", body: formData });
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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-[#ff6600]">
      <div className="rounded-2xl border border-[#ff6600]/50 backdrop-blur-xl shadow-[0_0_25px_#ff6600] p-4 sm:p-6 transition">
        {/* Mode Switch */}
        <div className="flex flex-col sm:flex-row bg-black/70 rounded-full border border-[#ff6600]/50 mb-6 overflow-hidden">
          <button
            onClick={() => setMode("textToImage")}
            className={`w-full sm:w-1/2 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === "textToImage"
                ? "bg-[#ff6600] text-black shadow-[0_0_20px_#ff6600]"
                : "text-[#ff6600]/70 hover:text-[#ff6600]"
            }`}
          >
            <Wand2 size={16} /> Text-to-Image
          </button>
          <button
            onClick={() => setMode("imageTo3d")}
            className={`w-full sm:w-1/2 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === "imageTo3d"
                ? "bg-[#ff6600] text-black shadow-[0_0_20px_#ff6600]"
                : "text-[#ff6600]/70 hover:text-[#ff6600]"
            }`}
          >
            <ImageIcon size={16} /> Image-to-3D
          </button>
        </div>

        {/* Input */}
        {mode === "textToImage" ? (
          <textarea
            className="w-full p-3 rounded-xl bg-black/50 border border-[#ff6600]/50 text-[#ff8533] placeholder-[#ff6600]/50 focus:outline-none focus:border-[#ff6600] shadow-inner resize-none"
            rows={2}
            placeholder="Describe your futuristic 3D object..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        ) : (
          <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer w-full sm:w-auto p-4 rounded-xl text-center border border-[#ff6600]/50 text-[#ff8533] bg-black/50 hover:border-[#ff6600] transition"
            >
              {inputFile ? `Selected: ${inputFile.name}` : "Click to upload image for 3D conversion"}
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
        <div className="flex justify-center sm:justify-end mt-4 sm:mt-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
              isGenerateDisabled
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-[#ff6600] text-black hover:scale-105 shadow-[0_0_20px_#ff6600]"
            }`}
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></span>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {error && <p className="text-center mt-4 text-red-400">{error}</p>}

        {/* Generated Image */}
        {generatedImageUrl && (
          <div className="mt-6 text-center">
            <img
              src={generatedImageUrl}
              alt="Generated"
              className="w-full max-w-md mx-auto rounded-xl shadow-[0_0_25px_#ff6600]"
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <button
                onClick={() => setMode("imageTo3d")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
              >
                Use this Image for 3D
              </button>
              <button
                onClick={() => handleDownload(generatedImageUrl, "generated_image.webp")}
                className="flex items-center gap-2 px-4 py-2 bg-[#ff6600] text-black rounded-lg hover:bg-[#ff8533] transition shadow-[0_0_15px_#ff6600] w-full sm:w-auto justify-center"
              >
                {downloading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Download size={16} /> Download Image
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Generated 3D Model */}
        {generatedModelUrl && (
          <div className="mt-6">
            <div className="w-full h-[50vh] sm:h-[60vh] rounded-xl border border-[#ff6600]/50 overflow-hidden shadow-[0_0_25px_#ff6600]">
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
                className="flex items-center gap-2 px-4 py-2 bg-[#ff6600] text-black rounded-lg hover:bg-[#ff8533] transition shadow-[0_0_15px_#ff6600] w-full sm:w-auto justify-center"
              >
                {downloading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Download size={16} /> Download 3D Model
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorComponent;
