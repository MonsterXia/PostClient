import ServerRules from "@/pages/rules/ServerRules";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/rules",
        element: <ServerRules />,
    },
    {
        path: "/",
        element: <div>Home</div>,
    },
])

export default router