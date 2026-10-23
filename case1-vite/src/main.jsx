import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import '@nce/eview-react/styles/aui3_1.css';
import '@nce/eview-react/styles/aui3_1_dark.css';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './styles/base.css';
import './styles/light.css';
import './styles/theme.css';
import './styles/dark.css';
import App from './app.jsx';

const locale = 'zh';
dayjs.locale('zh-cn');
createRoot(document.getElementById('root')).render(
    <IntlProvider locale={locale} messages={componentsLocales[locale]}>
        <App />
    </IntlProvider>
);
