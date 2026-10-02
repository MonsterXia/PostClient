import { useEffect, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { loadPlugins } from './markdown';
import './ServerRules.css';

type DocumentState =
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'ready'; markdown: string; plugins: Awaited<ReturnType<typeof loadPlugins>> };

const components: Components = {
    ul: ({ children, className }) => className === 'toc-list' ? (
        <details className="rules-toc">
            <summary><span>目录 · Contents</span></summary>
            <ul className={className}>{children}</ul>
        </details>
    ) : <ul className={className}>{children}</ul>,
    pre: ({ children }) => <pre className="code-block">{children}</pre>,
    code: ({ children, className }) => <code className={className}>{children}</code>,
};

function scrollToHeading() {
    if (!window.location.hash) return;
    try {
        document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
    } catch {
        // Malformed URL fragments should not prevent reading the document.
    }
}

export default function ServerRules() {
    const [state, setState] = useState<DocumentState>({ status: 'loading' });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            try {
                const response = await fetch('/rules/rule.md', { signal: controller.signal });
                if (!response.ok) throw new Error(`Rules request failed: ${response.status}`);
                const markdown = await response.text();
                if (!markdown.trim() || /^\s*(?:<!doctype html|<html)/i.test(markdown)) {
                    throw new Error('Rules response is empty or contains an HTML fallback');
                }
                const plugins = await loadPlugins(markdown);
                if (!controller.signal.aborted) setState({ status: 'ready', markdown, plugins });
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Unable to load rules', error);
                    setState({ status: 'error' });
                }
            }
        }
        void load();
        return () => controller.abort();
    }, [attempt]);

    useEffect(() => {
        if (state.status !== 'ready') return;
        const frame = requestAnimationFrame(scrollToHeading);
        window.addEventListener('hashchange', scrollToHeading);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('hashchange', scrollToHeading);
        };
    }, [state]);

    return (
        <article className="server-rules" lang="zh-CN" aria-busy={state.status === 'loading'}>
            {state.status === 'loading' && <p role="status">正在加载规则… / Loading rules…</p>}
            {state.status === 'error' && <div role="alert">
                <p>规则加载失败，请检查网络后重试。 / Unable to load rules.</p>
                <button className="rules-retry" type="button" onClick={() => {
                    setState({ status: 'loading' });
                    setAttempt((value) => value + 1);
                }}>重试 / Retry</button>
            </div>}
            {state.status === 'ready' && <ReactMarkdown {...state.plugins} components={components}>
                {state.markdown}
            </ReactMarkdown>}
        </article>
    );
}
