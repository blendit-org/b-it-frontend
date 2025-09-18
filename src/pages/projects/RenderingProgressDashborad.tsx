import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ProgressCard } from "./ProgressCard";
import { fetchProjects, type Project } from "./project.api";
import { motion, AnimatePresence } from "framer-motion";

const DISMISSED_KEY = "dismissedProjectsDashboard";

export const RenderingProgressDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dismissedProjects, setDismissedProjects] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  // Load dismissed projects from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DISMISSED_KEY);
    if (stored) {
      setDismissedProjects(new Set(JSON.parse(stored)));
    }
  }, []);

  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const files = await fetchProjects();
        setProjects(files.filter(p => !dismissedProjects.has(p.projectId)));
      } catch (err) {
        console.error(err);
        setProjects([]);
      }
    };
    loadProjects();
  }, [dismissedProjects]);

  const handleGoToProjects = (projectId: number) => {
    setProjects(prev => prev.filter(p => p.projectId !== projectId));

    const updated = new Set(dismissedProjects);
    updated.add(projectId);
    setDismissedProjects(updated);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(Array.from(updated)));

    navigate("/projects");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-orange-500">
          Your Render Progress
        </h2>
        <p className="mt-2 text-gray-400 max-w-xl mx-auto">
          Monitor your ongoing projects. Click a project to go to the download page once rendering is complete.
        </p>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map(project => (
              <motion.div
                key={project.projectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.03 }}
              >
                <ProgressCard
                  project={project}
                  context="dashboard"
                  onGoToProjects={() => handleGoToProjects(project.projectId)}
                  className="border border-orange-500 rounded-2xl shadow-lg"
                  
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          className="text-center text-orange-500 font-semibold mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No Projects Found
        </motion.div>
      )}
    </div>
  );
};
