import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton, ConfigProvider, Result, Button } from 'antd';
import { fetchServerAdminRegisterValidation } from "@/utils";
import { useSelector } from "react-redux";



const ServerAdminValidate: React.FC = () => {
    const params = useParams();
    const { messages, locale } = useSelector((state: any) => state.language);
    const [loading, setLoading] = useState(true);
    const [validateResult, setValidateResult] = useState<"success" | "error" | "info" | "warning" | undefined>("error");
    const navigate = useNavigate();

    useEffect(() => {
        const { username, otp } = params;
        console.log("Username: ", username);
        console.log("OTP: ", otp);

        const data2Push = {
            username: username,
            otp: otp
        }
        fetchServerAdminRegisterValidation(data2Push)
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
    }, []);


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