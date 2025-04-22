import Root from "@/pages/root/Root";
import ServerRules from "@/pages/rules/ServerRules";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <>Home</>,
            },
            {
                path: "rules",
                element: <ServerRules />
            },
        ],
    },
])

export default router