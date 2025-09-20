import App from "@/App";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Render from "@/pages/Render/Render";
import Verify from "@/pages/Auth/Verify";
import { createBrowserRouter } from "react-router";
import { ProjectsPage } from "@/pages/projects/Projects";
import Community from "@/pages/Community/Community";
import PromptDownloadPage from "@/pages/AiImageGenerator/generate3DByPrompt";
import GeneratorComponent from "@/pages/AiImageGenerator/generatorImageOR3D";
import chooseUser from "@/pages/chooseUser";
import Worker from "@/pages/Worker";

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
                Component: GeneratorComponent,
                path:"generate3d"
            },
            {
                Component: Community,
                path:"community"
            },
            {
                Component: ProjectsPage,
                path:"projects"
            },
            {
                Component: PromptDownloadPage,
                path: "blend"
            },
            {
                Component: GeneratorComponent,
                path: "textimage3D"
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
    },
    {
        Component: chooseUser,
        path: "/choose"
    },
    {
        Component: Worker,
        path:"/worker"
    }
]);

export default router;