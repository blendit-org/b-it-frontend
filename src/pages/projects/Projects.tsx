import React, { useEffect, useState } from "react";
import { ProgressCard } from "./ProgressCard";
import { fetchProjects, type Project } from "./project.api";
import { motion } from "framer-motion";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const files = await fetchProjects();
        setProjects(files.filter(p => p.renderingDone)); // only completed
      } catch (err) {
        console.error(err);
        setProjects([]);
      }
    };
    loadProjects();
  }, []);

  return (
    <div className="container flex flex-col mx-auto mt-10 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-orange-500">Projects Dashboard</h2>
        <p className="mt-2 text-gray-300">
          Download your completed projects here.
        </p>
      </motion.div>

      {projects.length ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.projectId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProgressCard project={project} context="projects" />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-orange-500 font-semibold"
        >
          No projects found.
        </motion.p>
      )}
    </div>
  );
};
