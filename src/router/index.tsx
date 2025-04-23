import Fallback from "@/pages/fallback/fallback";
import QuestionareComplete from "@/pages/questionares/Complete";
import LayerImprovment from "@/pages/questionares/LayerImprovment";
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
            {
                path: "questionares/complete",
                element: <QuestionareComplete />
            },
            {
                path: "questionares/",
                element: <LayerImprovment />,
            },
            {
                path: "*",
                element: <Fallback />
            }
        ],
    },
])

export default router