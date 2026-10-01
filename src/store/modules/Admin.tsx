import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PostAdmin } from '@/types/admin';

const admin = createSlice({
    name: 'admin',
    initialState: { adminInfo: null as PostAdmin | null },
    reducers: {
        setAdminInfo: (state, action: PayloadAction<PostAdmin | null>) => {
            state.adminInfo = action.payload;
        },
    },
});

export const { setAdminInfo } = admin.actions;
export default admin.reducer;
