import React, { useEffect } from 'react'
import { ConfigProvider, message, notification } from 'antd'
import SKUPage from './pages/SKUPage'
import 'antd/dist/reset.css'

function App() {
  useEffect(() => {
    // 配置全局通知
    message.config({
      top: 100,
      duration: 3,
      maxCount: 3,
    });
    
    // 配置全局notification
    notification.config({
      placement: 'topRight',
      duration: 4.5,
    });
  }, []);

  return (
    <ConfigProvider>
      <div className="App">
        <SKUPage />
      </div>
    </ConfigProvider>
  )
}

export default App
