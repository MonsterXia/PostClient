import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Skeleton, ConfigProvider, Result, Button } from 'antd';
import { fetchServerAdminRegisterValidation } from "@/utils";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";



const ServerAdminValidate: React.FC = () => {
    const { username, otp } = useParams();
    const { messages, locale } = useSelector((state: RootState) => state.language);
    const [loading, setLoading] = useState(true);
    const [validateResult, setValidateResult] = useState<"success" | "error" | "info" | "warning" | undefined>("error");
    const navigate = useNavigate();

    // StrictMode replays effects; share the one-time verification request across replays.
    const verification = useRef<{ key: string; promise: ReturnType<typeof fetchServerAdminRegisterValidation> } | null>(null);
    useEffect(() => {
        let active = true;
        setLoading(true);
        setValidateResult('error');
        if (!username || !otp) {
            setLoading(false);
            return;
        }
        const key = JSON.stringify([username, otp]);
        if (verification.current?.key !== key) {
            verification.current = { key, promise: fetchServerAdminRegisterValidation({ email: username, token: otp }) };
        }
        verification.current.promise.then(res => {
            if (active) setValidateResult(res.status === 200 || res.status === 201 ? 'success' : 'error');
        }).catch(() => {
            if (active) setValidateResult('error');
        }).finally(() => {
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, [otp, username]);


    return (
        <ConfigProvider
            locale={locale}
        >
            {loading ? <Skeleton active /> :  <Result
                status={validateResult}
                title={validateResult === "success" ? messages.registerSuccess: messages.registerFailed}
                subTitle={validateResult === "success" ? messages.registerSuccessVerificationTips: messages.registerFailedTips}
                extra={[
                    <Button key="login" type="primary" onClick={() => navigate("/server/login")}>
                        {messages.backToLogin}
                    </Button>
                ]}
            /> }
        </ConfigProvider>
    )
}

export default ServerAdminValidate;
