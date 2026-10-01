import { Result, Button, ConfigProvider } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "@/store";

const ServerRegisterSuccessfulPage: React.FC = () => {
    const { messages, locale } = useSelector((state: RootState) => state.language);
    const navigate = useNavigate();
    return (
        <ConfigProvider
            locale={locale}
        >
            <Result
                title={messages.registerPendingForVerification}
                subTitle={messages.registerPendingForVerificationTips}
                extra={[
                    <Button key="login" type="primary" onClick={() => navigate("/server/login")}>
                        {messages.backToLogin}
                    </Button>
                ]}
            />
        </ConfigProvider>
    )
}

export default ServerRegisterSuccessfulPage;
