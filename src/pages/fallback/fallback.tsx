import React from 'react';
import { ConfigProvider, Button, Result } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Fallback: React.FC = () => {
    const navigate = useNavigate();
    const { messages, locale } = useSelector((state: any) => state.language);

    return (
        <ConfigProvider
            locale={locale}
        >
            <Result
                status="404"
                title="404"
                subTitle={messages.fallback404Tips}
                extra={<Button type="primary" onClick={() => navigate("/")}>{messages.backhome}</Button>}
            />
        </ConfigProvider>
    );
}


export default Fallback;