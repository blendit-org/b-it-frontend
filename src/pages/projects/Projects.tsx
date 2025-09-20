"use client";

import React, { useEffect, useState } from "react";
import { ProgressCard } from "./ProgressCard";
import { fetchProjects, type Project } from "./project.api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // For search
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  // Check login
  useEffect(() => {
    if (!email) {
      navigate("/login");
      toast.error("You need to Login First");
    }
  }, [email]);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const files = await fetchProjects();
        const completed = files.filter((p) => p.renderingDone);
        setProjects(completed);
        setFilteredProjects(completed);
      } catch (err) {
        console.error(err);
        setProjects([]);
        setFilteredProjects([]);
      }
    };
    loadProjects();
  }, []);

  // Filter projects based on search
  useEffect(() => {
    const filtered = projects.filter((p) =>
      p.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  return (
    <div className="container flex flex-col mx-auto mt-5 p-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-bold text-orange-500">Projects Dashboard</h2>
        <p className="mt-2 text-gray-300">
          Download your completed projects here.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <input
          type="text"
          placeholder="Search projects by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-orange-400 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </motion.div>

      {/* Projects Grid */}
      {filteredProjects.length ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredProjects.map((project) => (
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
