import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ConfigProvider } from 'antd'

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en-gb';


import { RouterProvider } from 'react-router-dom'
import router from '@/router'

import { Provider } from 'react-redux'
import store from '@/store'

import './index.css'


if (process.env.NODE_ENV === 'production') {
  console.warn = () => { };
  console.error = () => { };
  console.log = () => { };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: '#13f0c0'
          },
          Menu: {
            itemBorderRadius: 20,
            itemBg: '#13f0c0',
            popupBg: '#13f0c0',
            itemColor: '#ffffff',
          },
        },
      }}
    >
      <Provider store={store}>
          <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  </StrictMode>
)
