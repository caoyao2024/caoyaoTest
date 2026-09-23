import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
// eview-react 主题 CSS（aui3_1 明色 / aui3_1_dark 暗色，<body> 常驻 aui3_1）
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';
// 源项目原始 token 体系（与 eview 变量并存，布局 CSS 一行不改）
import './styles/base.css';
import './styles/font.css';
import './styles/tokens.css';
import './styles/theme-dark.css';
import './styles/app.css';
import App from './app.jsx';

const locale = 'zh'; // 匹配 componentsLocales 的 key，不是 "zh-CN"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider>
      {/* IntlProvider 必须是 ConfigProvider 的直接子级，否则弹层（Dialog/Drawer 等 portal）取不到业务文案 */}
      <IntlProvider locale={locale} messages={componentsLocales[locale]}>
        <App />
      </IntlProvider>
    </ConfigProvider>
  </StrictMode>
);
