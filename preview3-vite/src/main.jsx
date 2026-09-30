import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import componentsLocales from '@nce/eview-react/locales';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import '@nce/eview-react/aui3_1.css';
import '@nce/eview-react/aui3_1_dark.css';
import './styles/base.css';
import './styles/font.css';
import './styles/tokens.css';
import './styles/theme-dark.css';
import { AppProvider } from './context.jsx';
import App from './app.jsx';

dayjs.locale('zh-cn');

const locale = 'zh';
const messages = componentsLocales[locale];

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider>
            <AppProvider>
                <IntlProvider locale={locale} messages={messages}>
                    <App />
                </IntlProvider>
            </AppProvider>
        </ConfigProvider>
    </StrictMode>
);
