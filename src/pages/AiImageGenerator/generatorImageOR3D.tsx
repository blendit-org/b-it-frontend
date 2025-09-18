// "use client";
// import { useState, Suspense, type ChangeEvent } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import {Wand2, Image as ImageIcon, Download } from "lucide-react";

// // Helper component for displaying the 3D model. No changes needed.
// function Model({ url }: { url: string }) {
//   const { scene } = useGLTF(url);
//   return <primitive object={scene} scale={1.5} />;
// }

// // The main component with combined functionality.
// const GeneratorComponent = () => {
//   type Mode = "textToImage" | "imageTo3d";

//   // UI State
//   const [mode, setMode] = useState<Mode>("textToImage");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Input State
//   const [prompt, setPrompt] = useState<string>("");
//   const [inputFile, setInputFile] = useState<File | null>(null);

//   // Output State
//   const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
//   const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setInputFile(e.target.files[0]);
//       setMode("imageTo3d");
//     }
//   };

//   const handleGenerate = async () => {
//     setLoading(true);
//     setError(null);
//     // Clear previous outputs when starting a new generation
//     if (mode === 'textToImage') setGeneratedImageUrl(null);
//     if (mode === 'imageTo3d') setGeneratedModelUrl(null);

//     try {
//       if (mode === "textToImage") {
//         await generateImage();
//       } else if (mode === "imageTo3d") {
//         await generate3DModel();
//       }
//     } catch (err) {
//       console.error("A critical error occurred:", err);
//       setError("An unexpected error occurred. Please check the console.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const generateImage = async () => {
//     if (!prompt) {
//       setError("Please enter a prompt.");
//       return;
//     }
//     const response = await fetch("http://localhost:5000/generate-image", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });

//     if (!response.ok) {
//       const errData = await response.json().catch(() => ({ error: "API returned an unreadable error." }));
//       setError(errData.error || "Failed to generate image.");
//       return;
//     }

//     const imageBlob = await response.blob();
//     const imageFile = new File([imageBlob], "generated-image.webp", { type: "image/webp" });
//     setInputFile(imageFile);
//     setGeneratedImageUrl(URL.createObjectURL(imageBlob));
//   };

//   const generate3DModel = async () => {
//     if (!inputFile) {
//       setError("Please select an image file first.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("image", inputFile);

//     const response = await fetch("http://localhost:5000/generate3d", {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//         const errData = await response.json().catch(() => ({ error: "API returned an unreadable error." }));
//         setError(errData.error || "Failed to generate model.");
//         return;
//     }

//     const modelBlob = await response.blob();
//     setGeneratedModelUrl(URL.createObjectURL(modelBlob));
//   };
  
//   const useImageFor3D = () => {
//       if (inputFile) {
//           setMode('imageTo3d');
//           setGeneratedModelUrl(null); 
//       }
//   }

//   // Helper function to trigger downloads
//   const handleDownload = (url: string, filename: string) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const isGenerateDisabled = loading || (mode === "textToImage" && !prompt.trim()) || (mode === "imageTo3d" && !inputFile);

//   return (
//     <div className="w-[500px] max-w-2xl p-4 grid place-items-center">
//       <div className="bg-white/90 dark:bg-black/90 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
        
//         <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-4">
//             <button onClick={() => setMode('textToImage')} className={`w-1/2 p-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${mode === 'textToImage' ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
//                 <Wand2 size={16}/> Text-to-Image
//             </button>
//             <button onClick={() => setMode('imageTo3d')} className={`w-1/2 p-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${mode === 'imageTo3d' ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
//                 <ImageIcon size={16}/> Image-to-3D
//             </button>
//         </div>

//         {mode === "textToImage" ? (
//           <textarea
//             className="w-full p-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base font-medium leading-relaxed border-b border-orange-300 focus:border-orange-500"
//             rows={2}
//             placeholder="Describe the image you want to create..."
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         ) : (
//           <div className="flex flex-col items-center gap-4">
//             <label htmlFor="file-upload" className="cursor-pointer w-full p-4 bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none text-base font-medium leading-relaxed border-b border-orange-300 focus:border-orange-500 text-center">
//               {inputFile ? `Selected: ${inputFile.name}` : "Click to select an image for 3D conversion"}
//             </label>
//             <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
//           </div>
//         )}

//         <div className="flex justify-end mt-4">
//           <button onClick={handleGenerate} disabled={isGenerateDisabled} className={`flex items-center justify-center px-6 py-3 rounded-xl shadow-lg transition text-white font-bold ${!isGenerateDisabled ? "bg-gradient-to-br from-orange-500 to-orange-600 hover:scale-105" : "bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed"}`}>
//             {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Generate'}
//           </button>
//         </div>

//         {loading && <p className="text-center mt-4 text-orange-500">Generating, please wait...</p>}
//         {error && <p className="text-center mt-4 text-red-500">{error}</p>}
        
//         {generatedImageUrl && (
//             <div className="mt-6 text-center">
//                 <img src={generatedImageUrl} alt="Generated from prompt" className="rounded-xl mx-auto shadow-lg" />
//                 <div className="flex justify-center gap-4 mt-4">
//                   <button onClick={useImageFor3D} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
//                       Use this Image for 3D
//                   </button>
//                   <button onClick={() => handleDownload(generatedImageUrl, 'generated_image.webp')} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
//                       <Download size={16}/> Download Image
//                   </button>
//                 </div>
//             </div>
//         )}

//         {generatedModelUrl && (
//           <div className="mt-6">
//             <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
//               <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
//                 <ambientLight intensity={0.7} />
//                 <directionalLight position={[10, 10, 5]} />
//                 <Suspense fallback={null}>
//                   <Model url={generatedModelUrl} />
//                 </Suspense>
//                 <OrbitControls />
//               </Canvas>
//             </div>
//             <div className="text-center mt-4">
//                 <button onClick={() => handleDownload(generatedModelUrl, 'generated_model.glb')} className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
//                     <Download size={16}/> Download 3D Model
//                 </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GeneratorComponent;

"use client";
import { useState, Suspense, type ChangeEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Wand2, Image as ImageIcon, Download } from "lucide-react";

// Helper component for displaying the 3D model. No changes needed.
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

// The main component with combined functionality.
const GeneratorComponent = () => {
  type Mode = "textToImage" | "imageTo3d";

  // UI State
  const [mode, setMode] = useState<Mode>("textToImage");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input State
  const [prompt, setPrompt] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | null>(null);

  // Output State
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
    // Clear previous outputs when starting a new generation
    if (mode === "textToImage") setGeneratedImageUrl(null);
    if (mode === "imageTo3d") setGeneratedModelUrl(null);

    try {
      if (mode === "textToImage") {
        await generateImage();
      } else if (mode === "imageTo3d") {
        await generate3DModel();
      }
    } catch (err) {
      console.error("A critical error occurred:", err);
      setError("An unexpected error occurred. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    const response = await fetch("http://localhost:5000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: "API returned an unreadable error." }));
      setError(errData.error || "Failed to generate image.");
      return;
    }

    const imageBlob = await response.blob();
    const imageFile = new File([imageBlob], "generated-image.webp", { type: "image/webp" });
    setInputFile(imageFile);
    setGeneratedImageUrl(URL.createObjectURL(imageBlob));
  };

  const generate3DModel = async () => {
    if (!inputFile) {
      setError("Please select an image file first.");
      return;
    }
    const formData = new FormData();
    formData.append("image", inputFile);

    const response = await fetch("http://localhost:5000/generate3d", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: "API returned an unreadable error." }));
      setError(errData.error || "Failed to generate model.");
      return;
    }

    const modelBlob = await response.blob();
    setGeneratedModelUrl(URL.createObjectURL(modelBlob));
  };

  const useImageFor3D = () => {
    if (inputFile) {
      setMode("imageTo3d");
      setGeneratedModelUrl(null);
    }
  };

  // Helper function to trigger downloads
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isGenerateDisabled =
    loading || (mode === "textToImage" && !prompt.trim()) || (mode === "imageTo3d" && !inputFile);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white/90 dark:bg-black/90 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-4">
          <button
            onClick={() => setMode("textToImage")}
            className={`w-1/2 p-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              mode === "textToImage" ? "bg-orange-500 text-white" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <Wand2 size={16} /> Text-to-Image
          </button>
          <button
            onClick={() => setMode("imageTo3d")}
            className={`w-1/2 p-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              mode === "imageTo3d" ? "bg-orange-500 text-white" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <ImageIcon size={16} /> Image-to-3D
          </button>
        </div>

        {mode === "textToImage" ? (
          <textarea
            className="w-full p-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base font-medium leading-relaxed border-b border-orange-300 focus:border-orange-500"
            rows={2}
            placeholder="Describe the image you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer w-full p-4 bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none text-base font-medium leading-relaxed border-b border-orange-300 focus:border-orange-500 text-center"
            >
              {inputFile ? `Selected: ${inputFile.name}` : "Click to select an image for 3D conversion"}
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

        <div className="flex justify-end mt-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className={`flex items-center justify-center px-6 py-3 rounded-xl shadow-lg transition text-white font-bold ${
              !isGenerateDisabled
                ? "bg-gradient-to-br from-orange-500 to-orange-600 hover:scale-105"
                : "bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {loading && <p className="text-center mt-4 text-orange-500">Generating, please wait...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}

        {generatedImageUrl && (
          <div className="mt-6 text-center">
            <img
              src={generatedImageUrl}
              alt="Generated from prompt"
              className="w-full max-w-md mx-auto rounded-xl shadow-lg"
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
              <button
                onClick={useImageFor3D}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Use this Image for 3D
              </button>
              <button
                onClick={() => handleDownload(generatedImageUrl, "generated_image.webp")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              >
                <Download size={16} /> Download Image
              </button>
            </div>
          </div>
        )}

        {generatedModelUrl && (
          <div className="mt-6">
            <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] max-h-[600px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
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
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              >
                <Download size={16} /> Download 3D Model
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorComponent;

