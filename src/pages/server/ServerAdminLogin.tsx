import {
    LockOutlined,
    MailOutlined
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormInstance,
    ProFormText,
    // setAlpha,
} from '@ant-design/pro-components';
import { Space, Tabs, message, theme, ConfigProvider, Button } from 'antd';
// import type { CSSProperties } from 'react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SliderCaptcha, { ActionType } from 'rc-slider-captcha';

import "./ServerAdminLogin.css"
import { fetchAdminEmailCheck, fetchServerAdminLogin, fetchServerAdminRegister } from '@/utils';
import emailRegex from 'email-regex';
import { useNavigate } from 'react-router-dom';
import { setAdminInfo } from '@/store/modules/Admin';
import type { RootState } from '@/store';

type LoginType = 'sign_in' | 'sign_up';

type LoginFormValues = {
    username?: string;
    password?: string;
    confirmPassword?: string;
}

const ServerAdminLogin: React.FC = () => {
    const formRef = useRef<ProFormInstance<LoginFormValues>>(null);
    const actionRef = useRef<ActionType>(undefined);
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>('sign_in');
    const [sliderVerified, setSliderVerified] = useState(false);
    const { messages, locale } = useSelector((state: RootState) => state.language);
    const [messageApi, contextHolder] = message.useMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const iconStyles: CSSProperties = {
    //     marginInlineStart: '16px',
    //     color: setAlpha(token.colorTextBase, 0.2),
    //     fontSize: '24px',
    //     verticalAlign: 'middle',
    //     cursor: 'pointer',
    // };

    // SliderCaptcha Parameters
    const controlBarWidth = 320;
    const controlButtonWidth = 40;
    const indicatorBorderWidth = 2;

    const emailAddressValidate = async (_rule: unknown, value: string) => {
        let valid = true

        if (!emailRegex().test(value)) {
            valid = false
        }

        if (valid) {
            const emailPush = {
                email: value,
            }

            try {
                const response = await fetchAdminEmailCheck(emailPush);
                if (response.status === 200) {
                    return Promise.resolve();
                }
            } catch (e) {
                if (typeof e === "object" && e !== null && "response" in e) {
                    const status = (e as { response: Response }).response.status
                    if (status === 409) {
                        return Promise.reject(new Error(messages.emailAlreadyExists));
                    }
                } else {
                    return Promise.reject(new Error(messages.serverError));
                }
            }

        }
        // console.log(response);
    }

    const handleLogin = async () => {
        let valid = true
        
        // 先触发表单验证
        try {
            await formRef.current?.validateFields?.();
        } catch (errorInfo) {
            // 表单验证失败，直接返回
            valid = false;
        }
        
        if (!valid) return;
        
        const values = formRef.current?.getFieldsFormatValue?.()
        const emailAddress = values?.username ?? ''

        if (!emailRegex().test(emailAddress)) {
            messageApi.open({
                type: 'error',
                content: messages.emailFormatError,
            });
            valid = false
        }

        if (!sliderVerified && loginType === 'sign_up') {
            messageApi.open({
                type: 'error',
                content: messages.plzFinishSliderVerification,
            });
            valid = false
        }

        if (loginType === 'sign_up') {
            if (values?.password !== values?.confirmPassword) {
                messageApi.open({
                    type: 'error',
                    content: messages.passwordsDoNotMatch,
                });
                valid = false
            }
        }

        if (valid) {
            if (loginType === 'sign_in') {
                const loginData = {
                    email: values?.username ?? '',
                    password: values?.password ?? '',
                }
                try {
                    setIsSubmitting(true)
                    messageApi.open({
                        type: 'warning',
                        content: messages.submitting,
                    });
                    const loginResponse = await fetchServerAdminLogin(loginData)
                    if (loginResponse.status === 200) {
                        // 后端通过cookie传递JWT，data字段直接是用户信息
                        dispatch(setAdminInfo(loginResponse.data))
                        navigate("/server")
                    }
                } catch {
                    setIsSubmitting(false)
                    messageApi.open({
                        type: 'error',
                        content: messages.userNotExistOrPasswordError,
                    });
                }
            } else if (loginType === 'sign_up') {
                const registerData = {
                    email: values?.username ?? '',
                    password: values?.password ?? '',
                }

                try {
                    setIsSubmitting(true)
                    messageApi.open({
                        type: 'warning',
                        content: messages.submitting,
                    });
                    const registerResponse = await fetchServerAdminRegister(registerData)
                    if (registerResponse.status === 200) {
                        navigate("/server/register/temperary")
                    }
                } catch (e) {
                    setIsSubmitting(false)
                    if (typeof e === "object" && e !== null && "response" in e) {
                        const status = (e as { response: Response }).response.status
                        if (status === 409) {
                            messageApi.open({
                                type: 'error',
                                content: messages.emailAlreadyExists,
                            });
                        }
                    } else {
                        messageApi.open({
                            type: 'error',
                            content: messages.serverError,
                        });
                    }
                }
            }
        }


        // console.log(sliderVerified)
        // console.log(
        //     '格式化后的所有数据：',
        //     values
        // );
    }

    return (
        <ProConfigProvider hashed={false}>
            <ConfigProvider
                locale={locale}
            >
                {contextHolder}
                <div style={{ backgroundColor: token.colorBgContainer }}>
                    <LoginForm
                        logo="/post.svg"
                        title={messages.serverAdminAccount}
                        submitter={false}
                        formRef={formRef}
                        actions={
                            <Space direction='vertical'>
                                {/* <Space>
                                    {messages.otherLoginOptions}
                                    <AlipayCircleOutlined style={iconStyles} />
                                    <TaobaoCircleOutlined style={iconStyles} />
                                    <WeiboCircleOutlined style={iconStyles} />
                                </Space> */}
                                {/* <div
                                    style={{
                                        textAlign: 'center',
                                    }}
                                >
                                    <span>
                                        ----- {messages.noAccount} -----
                                    </span>
                                    <br />
                                    <Button className='server-admin-signup-button'>{messages.signUp}</Button>
                                </div> */}
                            </Space>
                        }
                    >
                        <Tabs
                            centered
                            activeKey={loginType}
                            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                        >
                            <Tabs.TabPane key={'sign_in'} tab={messages.signIn} />
                            <Tabs.TabPane key={'sign_up'} tab={messages.signUp} />
                        </Tabs>
                        {loginType === 'sign_in' && (
                            <>
                                <ProFormText
                                    name="username"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <MailOutlined className={'prefixIcon'} />,
                                    }}
                                    placeholder={messages.email}
                                    rules={[
                                        {
                                            required: true,
                                            message: messages.plzEnterYourEmail,
                                        },
                                        {
                                            type: 'email',
                                            message: messages.plzEnterYourEmail,
                                        },
                                    ]}
                                />
                                <ProFormText.Password
                                    name="password"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={'prefixIcon'} />,
                                        strengthText: messages.strongPasswordTips,
                                        statusRender: (value) => {
                                            const getStatus = () => {
                                                if (value && value.length > 12) {
                                                    return 'ok';
                                                }
                                                if (value && value.length > 6) {
                                                    return 'pass';
                                                }
                                                return 'poor';
                                            };
                                            const status = getStatus();
                                            if (status === 'pass') {
                                                return (
                                                    <div style={{ color: token.colorWarning }}>
                                                        {messages.strength} {messages.medium}
                                                    </div>
                                                );
                                            }
                                            if (status === 'ok') {
                                                return (
                                                    <div style={{ color: token.colorSuccess }}>
                                                        {messages.strength} {messages.strong}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div style={{ color: token.colorError }}>{messages.strength} {messages.weak}</div>
                                            );
                                        },
                                    }}
                                    placeholder={messages.password}
                                    rules={[
                                        {
                                            required: true,
                                            message: messages.plzEnterYourPassword,
                                        },
                                        {
                                            min: 6,
                                            message: messages.passwordNotLessThan6,
                                        },
                                    ]}
                                />
                            </>
                        )}
                        {loginType === 'sign_up' && (
                            <>
                                <ProFormText
                                    name="username"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <MailOutlined className={'prefixIcon'} />,
                                    }}
                                    placeholder={messages.email}
                                    rules={[
                                        {
                                            required: true,
                                            message: messages.plzEnterYourEmail,
                                        },
                                        {
                                            type: 'email',
                                            message: messages.plzEnterYourEmail,
                                        },
                                        {
                                            validator: emailAddressValidate
                                        }

                                    ]}
                                />
                                <ProFormText.Password
                                    name="password"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={'prefixIcon'} />,
                                        strengthText: messages.strongPasswordTips,
                                        statusRender: (value) => {
                                            const getStatus = () => {
                                                if (!value) return 'poor';
                                                const hasUpper = /[A-Z]/.test(value);
                                                const hasLower = /[a-z]/.test(value);
                                                const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
                                                const hasMinLength = value.length >= 6;
                                                
                                                if (hasUpper && hasLower && hasSpecial && value.length >= 12) {
                                                    return 'ok';
                                                }
                                                if (hasUpper && hasLower && hasSpecial && hasMinLength) {
                                                    return 'pass';
                                                }
                                                return 'poor';
                                            };
                                            const status = getStatus();
                                            if (status === 'pass') {
                                                return (
                                                    <div style={{ color: token.colorWarning }}>
                                                        {messages.strength} {messages.medium}
                                                    </div>
                                                );
                                            }
                                            if (status === 'ok') {
                                                return (
                                                    <div style={{ color: token.colorSuccess }}>
                                                        {messages.strength} {messages.strong}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div style={{ color: token.colorError }}>{messages.strength} {messages.weak}</div>
                                            );
                                        },
                                    }}
                                    placeholder={messages.password}
                                    rules={[
                                        {
                                            required: true,
                                            message: messages.plzEnterYourPassword,
                                        },
                                        {
                                            min: 6,
                                            message: messages.passwordNotLessThan6,
                                        },
                                        {
                                            validator(_, value) {
                                                if (!value) return Promise.resolve();
                                                if (!/[A-Z]/.test(value)) {
                                                    return Promise.reject(new Error(messages.passwordMustContainUppercase));
                                                }
                                                if (!/[a-z]/.test(value)) {
                                                    return Promise.reject(new Error(messages.passwordMustContainLowercase));
                                                }
                                                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                                                    return Promise.reject(new Error(messages.passwordMustContainSpecialChar));
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                />
                                <ProFormText.Password
                                    name="confirmPassword"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={'prefixIcon'} />,
                                    }}
                                    placeholder={messages.confirmPassword}
                                    rules={[
                                        {
                                            required: true,
                                            message: messages.plzConfirmPassword,
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(messages.passwordsDoNotMatch));
                                            },
                                        }),
                                    ]}
                                />
                                {/* <ProFormCaptcha
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={'prefixIcon'} />,
                                    }}
                                    captchaProps={{
                                        size: 'large',
                                    }}
                                    placeholder={messages.OTP}
                                    captchaTextRender={(timing, count) => {
                                        if (timing) {
                                            return `${messages.reGetOTP} ${count} ${messages.seconds}`;
                                        }
                                        return `${messages.getOTP}`;
                                    }}
                                    name="captcha"
                                    phoneName="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: messages.plzEnterYourOTP,
                                        },
                                    ]}
                                    onGetCaptcha={async (username) => {
                                        console.log("username: ", username);
                                    }}
                                /> */}
                                <SliderCaptcha
                                    mode="slider"
                                    tipText={{
                                        default: messages.dragButtonToRight,
                                        moving: messages.dragButtonToRight,
                                        error: messages.verificationFailed,
                                        success: messages.verificationSuccess,
                                    }}
                                    errorHoldDuration={1000}
                                    puzzleSize={{
                                        left: indicatorBorderWidth,
                                        width: controlButtonWidth
                                    }}
                                    onVerify={(data) => {
                                        // console.log(data);
                                        if (data.x === controlBarWidth - controlButtonWidth - indicatorBorderWidth) {
                                            setSliderVerified(true);
                                            console.log('Slider verified');

                                            return Promise.resolve();
                                        }
                                        return Promise.reject();
                                    }}
                                    actionRef={actionRef}
                                />

                            </>
                        )}
                        <div
                            style={{
                                marginBlockEnd: 24,
                            }}
                        >
                            {/* <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox> */}
                            <a
                                style={{
                                    float: 'right',
                                }}
                            >
                                {messages.forgotPassword}
                            </a>
                        </div>
                        <Button
                            type="primary"
                            style={{
                                width: '100%',
                            }}
                            onClick={() => handleLogin()}
                            disabled={isSubmitting}
                        >
                            {loginType === 'sign_up' ? messages.signUp : messages.signIn}
                        </Button>
                    </LoginForm>
                </div>
            </ConfigProvider>
        </ProConfigProvider>
    );
};

export default ServerAdminLogin;
