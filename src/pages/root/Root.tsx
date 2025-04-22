import React, { useEffect } from 'react';
import { ConfigProvider, Layout, Menu, theme, Space, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import './Root.css';

import type { MenuProps } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '@/store/modules/messages';
const Root: React.FC = () => {
    const dispatch = useDispatch();
    const { messages, locale } = useSelector((state: any) => state.language);

    useEffect(() => {
        const language = navigator.language;
        if (language.startsWith('zh')) {
            dispatch(setLanguage('zh'));
        } else {
            dispatch(setLanguage('en'));
        }
    }, [dispatch])

    const handleLanguageChange = (lang: string) => {
        dispatch(setLanguage(lang));
    }

    const items: MenuProps['items'] = [
        {
            label: (
                <a onClick={() => handleLanguageChange('zh')}> 中文 </a>
            ),
            key: 'zh'
        },
        {
            label: (
                <a onClick={() => handleLanguageChange('en')}> English </a>
            ),
            key: 'en'
        },
    ];


    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { Header, Content, Footer } = Layout;

    const menuItems = [
        {
            key: "About Us",
            label: messages.aboutPost,
        },
        {
            key: "Rules",
            label: messages.rule,
        },
        // {
        //     key: "Questionares",
        //     label: messages.questionares,
        // }
    ]

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log(e.key);
        switch (e.key) {
            case "About Us":
                navigate("/");
                break;
            case "Rules":
                navigate("/rules");
                break;
            case "Questionares":
                navigate("/questionares");
                break;
            default:
                break;
        }
    }

    return (
        <ConfigProvider
            locale={locale}
        >
            <Layout className='root-layout' >
                <Header
                    className='root-layout-header'
                >
                    <img className='root-logo' src="/post.svg" alt="logo" />
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={["About Us"]}
                        items={menuItems}
                        className="root-layout-header-menu"
                        onClick={handleMenuClick}
                    />
                </Header>
                <Content className='root-layout-content'>
                    <div
                        className='root-layout-content-container'
                        style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <div className="root-layout-header-language">
                            <Dropdown menu={{ items }}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        {messages.changeLanguage}
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                        <Outlet />
                    </div>
                </Content>
                <Footer className='root-layout-footer'>
                    {messages.post} ©{new Date().getFullYear()} {messages.allRightsReserved}
                </Footer>
            </Layout>
        </ConfigProvider>
    );
};

export default Root;