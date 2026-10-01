import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router';
import { Button, Result, Skeleton } from 'antd';
import { isAxiosError } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetCurrentAdmin } from '@/utils/fetch';
import { setAdminInfo } from '@/store/modules/Admin';
import type { RootState } from '@/store';

export function AuthRoute({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'anonymous' | 'error'>('loading');
    const [attempt, setAttempt] = useState(0);
    const dispatch = useDispatch();
    const { messages } = useSelector((state: RootState) => state.language);

    useEffect(() => {
        let active = true;
        fetchGetCurrentAdmin().then(response => {
            if (!active) return;
            dispatch(setAdminInfo(response.data.data));
            setStatus('authenticated');
        }).catch(error => {
            if (!active) return;
            dispatch(setAdminInfo(null));
            const code = isAxiosError(error) ? error.response?.status : undefined;
            setStatus(code === 401 || code === 404 ? 'anonymous' : 'error');
        });
        return () => { active = false; };
    }, [attempt, dispatch]);

    if (status === 'loading') return <Skeleton active />;
    if (status === 'anonymous') return <Navigate to="/server/login" replace />;
    if (status === 'error') return <Result status="warning" title={messages.serverError}
        extra={<Button onClick={() => { setStatus('loading'); setAttempt(n => n + 1); }}>{messages.retry}</Button>} />;
    return <>{children}</>;
}
