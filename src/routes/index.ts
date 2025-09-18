import App from "@/App";
import Generate3D from "@/pages/AiImageGenerator/Generate3D";
import Gallery from "@/pages/Gallery/Gallery";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Render from "@/pages/Render/Render";
import Verify from "@/pages/Auth/Verify";
import { createBrowserRouter } from "react-router";
import { CommunityPage } from "@/pages/Community/Community";
import { ProjectsPage } from "@/pages/projects/Projects";

const router = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            {
                Component: Home,
                path: "/",
            },
            {
                Component: Render,
                path:"render"
            },
            {
                Component: Generate3D,
                path:"generate3d"
            },
            {
                Component: Gallery,
                path: "gallery"
            },
            {
                Component: CommunityPage,
                path:"community"
            },
            {
                Component: ProjectsPage,
                path:"projects"
            }
        ]
    },
    {
        Component: Login,
        path: "/login"
    },
    {
        Component: Register,
        path:"/register"
    },
    {
        Component: Verify,
        path:"/verify"
    }
]);

export default router;