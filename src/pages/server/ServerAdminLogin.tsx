import React, { useState } from 'react';
import { Button, Form, Input, message, Steps, theme, ConfigProvider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setToken } from '@/utils';
import { usernameCheckAPI, serverAdminLoginAPI, serverAdminRegisterAPI } from '@/apis';

const ServerAdminLogin: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const { messages, locale } = useSelector((state: RootState) => state.language);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    const [email, setEmail] = useState('');


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: messages.step1,
            content: 'First-content',
        },
        {
            title: messages.step2,
            content: 'Second-content',
        },
        {
            title: messages.step3,
            content: 'Last-content',
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const onFinishStep1 = async (values: { email: string }) => {
        try {
            const emailPush = {
                email: values.email,
            };
            const response = await usernameCheckAPI(emailPush);
            if (response.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: messages.emailValid,
                });
                setEmail(values.email);
                next();
            } else if (response.status === 201) {
                messageApi.open({
                    type: 'success',
                    content: messages.emailRegistered,
                });
                setEmail(values.email);
                next();
            } else {
                messageApi.open({
                    type: 'error',
                    content: messages.emailInvalid,
                });
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: messages.emailInvalid,
            });
        }
    };

    const onFinishStep2 = async (values: { username: string; password: string; confirmPassword: string }) => {
        if (values.password !== values.confirmPassword) {
            messageApi.open({
                type: 'error',
                content: messages.passwordNotMatch,
            });
            return;
        }

        try {
            const loginData = {
                email: email,
                password: values.password,
            };
            const loginResponse = await serverAdminLoginAPI(loginData);
            if (loginResponse.status === 200) {
                setToken(loginResponse.data.token);
                messageApi.open({
                    type: 'success',
                    content: messages.loginSuccess,
                });
                navigate('/server');
                return;
            }
        } catch (error) {
            // Login failed, try register
        }

        try {
            const registerData = {
                email: email,
                username: values.username,
                password: values.password,
            };
            const registerResponse = await serverAdminRegisterAPI(registerData);
            if (registerResponse.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: messages.registerSuccess,
                });
                next();
            } else {
                messageApi.open({
                    type: 'error',
                    content: messages.registerFailed,
                });
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: messages.registerFailed,
            });
        }
    };

    const renderStepContent = () => {
        switch (current) {
            case 0:
                return (
                    <Form form={form} onFinish={onFinishStep1} layout="vertical">
                        <Form.Item
                            name="email"
                            label={messages.email}
                            rules={[{ required: true, message: messages.pleaseInputEmail }, { type: 'email', message: messages.emailInvalid }]}
                        >
                            <Input prefix={<MailOutlined />} placeholder={messages.emailPlaceholder} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {messages.next}
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case 1:
                return (
                    <Form form={form} onFinish={onFinishStep2} layout="vertical">
                        <Form.Item
                            name="username"
                            label={messages.username}
                            rules={[{ required: true, message: messages.pleaseInputUsername }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder={messages.usernamePlaceholder} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label={messages.password}
                            rules={[{ required: true, message: messages.pleaseInputPassword }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder={messages.passwordPlaceholder} />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label={messages.confirmPassword}
                            rules={[{ required: true, message: messages.pleaseInputConfirmPassword }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder={messages.confirmPasswordPlaceholder} />
                        </Form.Item>
                        <Form.Item>
                            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                {messages.previous}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {messages.next}
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case 2:
                return (
                    <div>
                        <p>{messages.registerSuccess}</p>
                        <Button type="primary" onClick={() => navigate('/server')}>
                            {messages.goToServer}
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ConfigProvider locale={locale}>
            <div style={{ padding: '24px', background: colorBgContainer, borderRadius: borderRadiusLG }}>
                {contextHolder}
                <Steps current={current} items={items} />
                <div style={{ marginTop: '24px' }}>
                    {renderStepContent()}
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ServerAdminLogin;
