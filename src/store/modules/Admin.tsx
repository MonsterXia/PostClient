import { createSlice } from "@reduxjs/toolkit";

const admin = createSlice({
    name: "admin",
    initialState: {
        adminToken: "",
        adminInfo: {},
    },
    reducers: {
        setAdminToken: (state, action) => {
            let tokenStr = action.payload.substring(7);
            state.adminToken = tokenStr;
            // console.log("adminToken", state.adminToken);
        },
        setAdminInfo: (state, action) => {
            state.adminInfo = action.payload;
            // console.log("adminInfo", state.adminInfo);
        },
    },
})

const {setAdminToken, setAdminInfo} = admin.actions;
const adminReducer = admin.reducer;

export {setAdminToken, setAdminInfo};
export default adminReducer;