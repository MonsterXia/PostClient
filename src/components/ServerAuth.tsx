import { getToken } from "@/utils";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export function AuthRoute({ children }: { children: ReactNode }) {
    const token = getToken();

    if ( token && token !== "undefined" && token !== "null") {
        return <>{children}</>
    }else {
        return <Navigate to={'/server/login'} replace />
    }
}