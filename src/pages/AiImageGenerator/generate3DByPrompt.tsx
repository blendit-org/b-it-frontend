"use client";
import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const BASE_URL_DOWNLOAD = "http://localhost:5000/download"; // replace with your backend URL

const getToken = () => localStorage.getItem("token") || "";

export const downloadProject = async (prompt: string, fileName?: string) => {
  const token = getToken();

  const res = await axios.post(
    BASE_URL_DOWNLOAD,
    { prompt },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const downloadUrl: string = res.data.url;

  const fileResponse = await fetch(downloadUrl);
  if (!fileResponse.ok) throw new Error("Failed to fetch file");

  const blob = await fileResponse.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName || "generated_scene"}.blend`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default function PromptDownloadPage() {
  const [prompt, setPrompt] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoadingGenerate(true);
      setDownloadUrl(null);

      const token = getToken();
      const res = await axios.post(
        BASE_URL_DOWNLOAD,
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDownloadUrl(res.data.url);
      toast.success("3D Model is ready ✅");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      setLoadingDownload(true);
      await downloadProject(prompt);
      toast.success("Download completed 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Download failed ❌");
    } finally {
      setLoadingDownload(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-orange-400 font-mono">
      <Toaster richColors position="top-right" />

      {/* Sci-fi Header */}
      <h1 className="text-4xl font-extrabold mb-10 tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400 animate-pulse uppercase">
        blend:it 3D Generator
      </h1>

      {/* Input Section */}
      <div className="flex flex-col items-center space-y-4 w-[90%] max-w-lg p-6 border border-orange-500/40 rounded-2xl shadow-[0_0_20px_rgba(255,128,0,0.4)] backdrop-blur-md">
        <input
          type="text"
          placeholder="Describe your 3D world..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-5 py-3 bg-transparent text-orange-200 placeholder-orange-400 border border-orange-500/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 tracking-wide"
        />

        <button
          onClick={handleSubmit}
          disabled={loadingGenerate || !prompt}
          className="relative w-full py-3 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-cyan-500 text-black shadow-[0_0_15px_rgba(255,128,0,0.7)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingGenerate ? "⚡ Synthesizing Geometry..." : "🚀 Generate .blend"}
        </button>
      </div>

      {/* Download Card */}
      {downloadUrl && (
        <div className="mt-10 w-[90%] max-w-lg p-6 border border-cyan-400/50 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.5)] text-cyan-300 flex flex-col items-center space-y-3 backdrop-blur-md">
          <p className="text-sm uppercase tracking-wider">
            Blend file ready for extraction
          </p>
          <button
            onClick={handleDownload}
            disabled={loadingDownload}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-orange-500 text-black shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingDownload ? "⬇️ Downloading..." : "⬇️ Download .blend"}
          </button>
        </div>
      )}
    </div>
  );
}
