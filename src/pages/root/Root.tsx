import { useEffect } from 'react';
import { ConfigProvider, Dropdown } from 'antd';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '@/store/modules/messages';
import type { RootState } from '@/store';
import './Root.css';

function Root() {
    const dispatch = useDispatch();
    const { messages, locale } = useSelector((state: RootState) => state.language);

    useEffect(() => {
        dispatch(setLanguage(navigator.language.startsWith('zh') ? 'zh' : 'en'));
    }, [dispatch]);

    return (
        <ConfigProvider locale={locale}>
            <div className="root-layout">
                <header className="root-layout-header">
                    <div className="root-header-inner">
                        <Link className="root-brand" to="/rules" aria-label={messages.post}>
                            <img className="root-logo" src="/post.svg" alt="" />
                            <span>{messages.post}<small>POST COMMUNITY</small></span>
                        </Link>
                        <div className="root-header-actions">
                            <Link className="root-rules-link" to="/rules" aria-current="page">{messages.rule}</Link>
                            <Dropdown
                                trigger={['click']}
                                menu={{
                                    items: [{ key: 'zh', label: '中文' }, { key: 'en', label: 'English' }],
                                    onClick: ({ key }) => dispatch(setLanguage(key)),
                                }}
                            >
                                <button className="root-language" type="button" aria-label={messages.changeLanguage}>
                                    <GlobalOutlined />
                                    <span>{locale.locale === 'zh-cn' ? '中文' : 'English'}</span>
                                    <DownOutlined className="root-language-chevron" />
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                </header>
                <main className="root-layout-content">
                    <div className="root-document-label">POST / COMMUNITY GUIDELINES</div>
                    <Outlet />
                </main>
                <footer className="root-layout-footer">
                    <span>{messages.post} © 2019–{new Date().getFullYear()}</span>
                    <span>{messages.allRightsReserved}</span>
                </footer>
            </div>
        </ConfigProvider>
    );
}

export default Root;
