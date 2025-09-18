import axios from "axios";

export interface Project {
  userId?: string;
  startFrame?: number;
  endFrame?: number;
  renderingDone?: boolean;
  projectId: number;
  fileName?: string;
}

export interface IStatus {
  renderedFrames: number;
  totalFrames: number;
}

const BASE_URL_PROJECTS = "http://10.201.48.47:4000/api/files/all";
const BASE_URL_FRAMES = "http://10.201.48.47:8010/project/status/frames-rendered";
const BASE_URL_DOWNLOAD = "http://10.201.48.47:8011/project/download";

const getToken = () => localStorage.getItem("token");

export const fetchProjects = async (): Promise<Project[]> => {
  const token = getToken();
  const res = await axios.get<{ files: Project[] }>(BASE_URL_PROJECTS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.files;
};

export const fetchProjectProgress = async (
  projectId: number,
  startFrame?: number,
  endFrame?: number
): Promise<IStatus> => {
  const token = getToken();
  const res = await axios.post<IStatus>(
    BASE_URL_FRAMES,
    { projectId, startFrame, endFrame },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const downloadProject = async (projectId: number, fileName?: string) => {
  const token = getToken();
  const res = await axios.post(BASE_URL_DOWNLOAD, { projectId }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const downloadUrl: string = res.data.url;
  const fileResponse = await fetch(downloadUrl);
  if (!fileResponse.ok) throw new Error("Failed to fetch file");

  const blob = await fileResponse.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName || `project_${projectId}`}.zip`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
