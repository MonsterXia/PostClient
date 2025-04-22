import { createSlice } from "@reduxjs/toolkit";

const admin = createSlice({
    name: "admin",
    initialState: {
        adminToken: "",
    },
    reducers: {
        setAdminToken: (state, action) => {
            state.adminToken = action.payload;
        },
    },
})

const {setAdminToken} = admin.actions;
const adminReducer = admin.reducer;

export {setAdminToken};
export default adminReducer;