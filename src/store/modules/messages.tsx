import { createSlice } from "@reduxjs/toolkit";

import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

import zhMessages from '@/locale/zh'
import enMessages from '@/locale/en'




const language = createSlice({
    name: "language",
    initialState: {
        locale: zhCN,
        messages: zhMessages,
    },
    reducers: {
        setLanguage: (state, action) => {
            if (action.payload === 'zh') {
                state.locale = zhCN;
                state.messages = zhMessages;
            } else {
                state.locale = enUS;
                state.messages = enMessages;
            }
        }
    },
})

const {setLanguage} = language.actions;
const languageReducer = language.reducer;

export {setLanguage};
export default languageReducer;