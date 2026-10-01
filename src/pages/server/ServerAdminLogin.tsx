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
import { isAxiosError } from 'axios';
import { passwordValidationError } from '@/utils/password';
import { useNavigate } from 'react-router';
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
        if (!value || !emailRegex({ exact: true }).test(value)) return;
        let available: boolean;
        try {
            const response = await fetchAdminEmailCheck({ email: value });
            available = response.data.data;
        } catch (error) {
            const status = isAxiosError(error) ? error.response?.status : undefined;
            throw new Error(status === 409 ? messages.emailAlreadyExists : messages.serverError);
        }
        if (!available) throw new Error(messages.emailAlreadyExists);
    };

    const handleLogin = async () => {
        if (isSubmitting) return;
        let values: LoginFormValues;
        try {
            values = await formRef.current!.validateFields();
        } catch {
            return;
        }
        if (loginType === 'sign_up' && !sliderVerified) {
            messageApi.error(messages.plzFinishSliderVerification);
            return;
        }
        setIsSubmitting(true);
        const credentials = { email: values.username ?? '', password: values.password ?? '' };
        try {
            if (loginType === 'sign_in') {
                const response = await fetchServerAdminLogin(credentials);
                dispatch(setAdminInfo(response.data.data));
                navigate('/server', { replace: true });
            } else {
                await fetchServerAdminRegister(credentials);
                navigate('/server/register/temperary');
            }
        } catch (error) {
            const status = isAxiosError(error) ? error.response?.status : undefined;
            messageApi.error(loginType === 'sign_in' && status === 401
                ? messages.userNotExistOrPasswordError
                : loginType === 'sign_up' && status === 409
                    ? messages.emailAlreadyExists
                    : messages.serverError);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            onChange={(activeKey) => { setLoginType(activeKey as LoginType); setSliderVerified(false); }}
                            items={[
                                { key: 'sign_in', label: messages.signIn, disabled: isSubmitting },
                                { key: 'sign_up', label: messages.signUp, disabled: isSubmitting },
                            ]}
                        />
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
                                    validateTrigger="onBlur"
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
                                                const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
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
                                                const errorKey = passwordValidationError(value);
                                                if (errorKey) return Promise.reject(new Error(messages[errorKey]));
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
                                    dependencies={['password']}
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
