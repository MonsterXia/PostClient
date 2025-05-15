import Fallback from "@/pages/fallback/fallback";
import QuestionareComplete from "@/pages/questionares/Complete";
import LayerImprovment from "@/pages/questionares/LayerImprovment";
import TestComponent from "@/pages/test/test";
import Root from "@/pages/root/Root";
import ServerRules from "@/pages/rules/ServerRules";
import { createBrowserRouter } from "react-router-dom";
import ServerIndex from "@/pages/server/ServerIndexPage"
import ServerAdminLogin from "@/pages/server/ServerAdminLogin";
import { AuthRoute } from "@/components/ServerAuth";
import ServerAdminValidate from "@/pages/server/ServerAdminValidate";
import ServerRegisterSuccessfulPage from "@/pages/server/ServerRegisterSuccessfulPage";

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
                path: "server/login",
                element: <ServerAdminLogin  />,
            },
            {
                path: "server/register/temperary",
                element: <ServerRegisterSuccessfulPage  />,
            },
            {
                path: "server/register/username/:username/:otp",
                element: <ServerAdminValidate  />,
            },
            {
                path: "server/",
                element: <AuthRoute><ServerIndex /></AuthRoute>,
            },
            {
                path: "test",
                element: <TestComponent />,
            },
            {
                path: "*",
                element: <Fallback />
            }
        ],
    },
])

export default router