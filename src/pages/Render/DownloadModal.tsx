import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { downloadProject } from "../projects/project.api";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectId: number;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  projectName,
  projectId,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadProject(projectId, projectName);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAndNavigate = () => {
    onClose();
    navigate("/projects");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full relative">
        <button
          onClick={handleCloseAndNavigate}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-2">Rendering Complete!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Your project "<span className="font-semibold">{projectName}</span>" is ready to download.
        </p>

        <div className="flex gap-4 mt-4">
          <Button
            onClick={handleDownload}
            className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download File"}
          </Button>
          <Button
            onClick={handleCloseAndNavigate}
            variant="outline"
            className="flex-1"
          >
            Go to Projects
          </Button>
        </div>
      </div>
    </div>
  );
};
