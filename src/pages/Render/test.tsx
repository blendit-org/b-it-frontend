

// types.ts (or keep in same file if you prefer)


// // Mock projects
// export const mockProjects: Project[] = [
//   {
//     id: 'proj-01',
//     name: 'Apartment Complex - V1',
//     progress: 85,
//     status: 'rendering',
//   },
//   {
//     id: 'proj-02',
//     name: 'Forest Scene - Final',
//     progress: 100,
//     status: 'completed',
//     completedAt: new Date().toLocaleString(),
//     fileType: 'blend',
//   },
//   {
//     id: 'proj-03',
//     name: 'Product Shot - High-Res',
//     progress: 42,
//     status: 'rendering',
//   },
// ];

import { useEffect } from "react";
import axios from "axios";

export const TestRequests = () => {
 useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      // 1️⃣ First request
      const res = await axios.get("http://10.201.48.47:4000/api/files/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Projects data:", res.data);

      // 👀 adjust depending on actual response shape
      const projectList = res.data.files || res.data; // handle both cases
      if (!Array.isArray(projectList) || projectList.length === 0) {
        console.warn("No projects found");
        return;
      }

      const project = projectList[0]; // first project

      // 2️⃣ Second request
      const frameRes = await axios.post(
        "http://10.201.48.47:8010/project/status/frames-rendered",
        {
          projectId: project.projectId,
          startFrame: project.startFrame,
          endFrame: project.endFrame,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Frame status:", frameRes.data);
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  fetchData();
}, []);


  return <div>Check console for API requests 🚀</div>;
};




