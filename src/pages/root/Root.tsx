import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router';
import translations from '@/locale/locale.json';
import './Root.css';

type Language = 'zh' | 'en';

export default function Root() {
    const [language, setLanguage] = useState<Language>(() => navigator.language.startsWith('zh') ? 'zh' : 'en');
    const message = (key: keyof typeof translations) => translations[key][language];

    useEffect(() => {
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
        document.title = `${translations.rule[language]} · Post`;
    }, [language]);

    return (
        <div className="root-layout">
            <a className="skip-link" href="#main-content">{language === 'zh' ? '跳至正文' : 'Skip to content'}</a>
            <header className="root-layout-header">
                <div className="root-header-inner">
                    <Link className="root-brand" to="/rules" aria-label={message('post')}>
                        <img className="root-logo" src="/post.svg" alt="" width="50" height="50" />
                        <span>{message('post')}<small>POST COMMUNITY</small></span>
                    </Link>
                    <nav className="root-header-actions" aria-label={language === 'zh' ? '主导航' : 'Main navigation'}>
                        <Link className="root-rules-link" to="/rules" aria-current="page">{message('rule')}</Link>
                        <select className="root-language" aria-label={message('changeLanguage')} value={language}
                            onChange={(event) => setLanguage(event.target.value as Language)}>
                            <option value="zh">中文</option>
                            <option value="en">English</option>
                        </select>
                    </nav>
                </div>
            </header>
            <main id="main-content" tabIndex={-1} className="root-layout-content">
                <div className="root-document-label">POST / COMMUNITY GUIDELINES</div>
                <Outlet />
            </main>
            <footer className="root-layout-footer">
                <span>{message('post')} © 2019–{new Date().getFullYear()}</span>
                <span>{message('allRightsReserved')}</span>
            </footer>
        </div>
    );
}
