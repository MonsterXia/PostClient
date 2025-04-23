import React from 'react';
import { ConfigProvider, Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QuestionareComplete: React.FC = () => {
    const navigate = useNavigate();
    const { messages, locale } = useSelector((state: any) => state.language);
    return (
        <ConfigProvider
            locale={locale}
        >
            <Result
                status="success"
                title={messages.questionare_complete}
                extra={<Button type="primary" onClick={() => navigate("/")}>{messages.backhome}</Button>}
            />
        </ConfigProvider>
    );
}

export default QuestionareComplete;