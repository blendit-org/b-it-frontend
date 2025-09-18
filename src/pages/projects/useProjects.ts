import { useEffect, useState } from "react";
import { fetchProjectProgress, fetchProjects, type IStatus, type Project } from "./project.api";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [progress, setProgress] = useState<Record<number, IStatus>>({});

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const files = await fetchProjects();
        setProjects(files);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      projects.forEach(async (p) => {
        if (!p.renderingDone) {
          try {
            const status = await fetchProjectProgress(p.projectId, p.startFrame, p.endFrame);
            setProgress((prev) => ({ ...prev, [p.projectId]: status }));
          } catch (err) {
            console.error("Error fetching progress:", err);
          }
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [projects]);

  return { projects, progress, setProjects };
};
