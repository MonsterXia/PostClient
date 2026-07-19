import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton, ConfigProvider, Result, Button } from 'antd';
import { serverAdminRegisterValidationAPI } from "@/apis";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";



const ServerAdminValidate: React.FC = () => {
    const { username, otp } = useParams();
    const { messages, locale } = useSelector((state: RootState) => state.language);
    const [loading, setLoading] = useState(true);
    const [validateResult, setValidateResult] = useState<"success" | "error" | "info" | "warning" | undefined>("error");
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Username: ", username);
        console.log("OTP: ", otp);

        const data2Push = {
            username: username,
            otp: otp
        }
        serverAdminRegisterValidationAPI(data2Push)
            .then((res) => {
                console.log("Response: ", res);
                if (res.status === 200) {
                    setValidateResult("success");
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }).catch((err) => {
                console.log("Error: ", err);
                setLoading(false);
            })
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
                    <Button type="primary" onClick={() => navigate("/server/login")}>
                        {messages.backToLogin}
                    </Button>
                ]}
            /> }
        </ConfigProvider>
    )
}

export default ServerAdminValidate;
