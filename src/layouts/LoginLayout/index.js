/**
 * @description 登录页布局
 */

import React from 'react';
import {ConfigProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

function App({children}) {
  return (
    <ConfigProvider locale={zh_CN}>
      {children || <h1>此处为你的组件</h1>}
    </ConfigProvider>
  )
}

export default App;
