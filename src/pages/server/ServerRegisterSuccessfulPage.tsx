import { Result, Button, ConfigProvider } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ServerRegisterSuccessfulPage: React.FC = () => {
    const { messages, locale } = useSelector((state: any) => state.language);
    const navigate = useNavigate();
    return (
        <ConfigProvider
            locale={locale}
        >
            <Result
                title={messages.registerPendingForVerification}
                subTitle={messages.registerPendingForVerificationTips}
                extra={[
                    <Button type="primary" onClick={() => navigate("/server/login")}>
                        {messages.backToLogin}
                    </Button>
                ]}
            />
        </ConfigProvider>
    )
}

export default ServerRegisterSuccessfulPage;