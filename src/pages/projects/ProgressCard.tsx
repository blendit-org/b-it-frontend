import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { downloadProject, fetchProjectProgress, type IStatus, type Project } from "./project.api";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProgressCardProps {
  project: Project;
  context: "projects" | "dashboard";
  onGoToProjects?: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ project, context, onGoToProjects }) => {
  const [progress, setProgress] = useState<IStatus | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const LOCAL_STORAGE_KEY = "downloadingProjects";

  // Load download status from localStorage
  useEffect(() => {
    const downloading = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]") as number[];
    setLoadingDownload(downloading.includes(project.projectId));
  }, [project.projectId]);

  // Fetch project rendering progress
  useEffect(() => {
    if (project.renderingDone) return;

    const fetchProgress = async () => {
      try {
        setIsFetching(true);
        const status = await fetchProjectProgress(project.projectId, project.startFrame, project.endFrame);
        setProgress(status);
        if (status.renderedFrames >= status.totalFrames) project.renderingDone = true;
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 3000);
    return () => clearInterval(interval);
  }, [project]);

  const percentage = progress && progress.totalFrames > 0
    ? Math.round((progress.renderedFrames / progress.totalFrames) * 100)
    : 0;

  const handleDownload = async () => {
    setLoadingDownload(true);

    // Add to localStorage
    const downloading = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]") as number[];
    if (!downloading.includes(project.projectId)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...downloading, project.projectId]));
    }

    // Show a “Soon” toast immediately
    toast(`Download for project #${project.fileName} started!`);

    try {
      await downloadProject(project.projectId, project.fileName);

      // Show success toast
      toast.success(`${project.fileName} Download Complete`);

      // Remove from localStorage and stop spinner
      const updated = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]") as number[];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.filter(id => id !== project.projectId)));
      setLoadingDownload(false);

    } catch (err) {
      console.error(err);
      toast.error("Download failed. Try again.");

      const updated = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]") as number[];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.filter(id => id !== project.projectId)));
      setLoadingDownload(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-orange-300 flex flex-col h-full rounded-xl hover:shadow-2xl transition-shadow duration-300 text-white">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg font-semibold text-orange-400">
            {project.fileName || `Project #${project.projectId}`}
          </CardTitle>
          <p className={`font-semibold ${project.renderingDone ? "text-green-400" : "text-yellow-400"} flex items-center justify-center gap-2`}>
            {project.renderingDone ? "✅ Completed" :
              <>
                Rendering
                <span className="animate-spin">⏳</span>
              </>
            }
          </p>
          {!project.renderingDone && progress && (
            <p className="text-sm text-gray-400 mt-1">
              Frames: {progress.renderedFrames} / {progress.totalFrames}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {!project.renderingDone && progress && (
            <>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-orange-500 h-3"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-center text-gray-400 mt-1">{percentage}%</p>
            </>
          )}

          {project.renderingDone && context === "projects" && (
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white mt-3 shadow-lg shadow-orange-500/30 transition transform hover:scale-105 flex items-center justify-center gap-2"
              onClick={handleDownload}
              disabled={loadingDownload}
            >
              {loadingDownload && <span className="animate-spin">⏳</span>}
              {loadingDownload ? "Downloading..." : "Download File"}
            </Button>
          )}

          {project.renderingDone && context === "dashboard" && (
            <motion.button
              onClick={onGoToProjects}
              className="mt-3 text-blue-400 underline hover:text-blue-600 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Projects to download
            </motion.button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
