import Root from "@/pages/root/Root";
import ServerRules from "@/pages/rules/ServerRules";
import { createBrowserRouter, Navigate } from "react-router";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Navigate to="/rules" replace />,
            },
            {
                path: "rules",
                element: <ServerRules />,
            },
            {
                path: "*",
                element: <Navigate to="/rules" replace />,
            },
        ],
    },
]);

export default router;
