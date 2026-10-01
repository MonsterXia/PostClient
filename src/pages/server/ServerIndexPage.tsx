import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServerAdminLogout } from '@/utils/fetch';
import { setAdminInfo } from '@/store/modules/Admin';
import type { RootState } from '@/store';

export default function ServerIndex() {
    const { adminInfo } = useSelector((state: RootState) => state.admin);
    const { messages } = useSelector((state: RootState) => state.language);
    const [pending, setPending] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logout = async () => {
        setPending(true);
        try {
            await fetchServerAdminLogout();
            dispatch(setAdminInfo(null));
            navigate('/server/login', { replace: true });
        } catch {
            messageApi.error(messages.serverError);
        } finally {
            setPending(false);
        }
    };
    return <div>
        {contextHolder}
        <h1>{messages.serverAdminAccount}</h1>
        <p>{adminInfo?.email}</p>
        <Button onClick={logout} loading={pending}>{messages.signOut}</Button>
        <Outlet />
    </div>;
}
