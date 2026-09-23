import { useIntl } from "react-intl";
import IconButton from "@nce/eview-react/IconButton";
import TextField from "@nce/eview-react/TextField";
import Badge from "@nce/eview-react/Badge";
import { FormattedMessage } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 顶部导航栏 — 品牌 / 全局导航（手写）/ 国际化切换（手写 Segmented）/ 明暗切换 / 用户区
// antd Menu / Segmented 无对应 → 手写；纯图标 Button → IconButton（tipText 替代 Tooltip）
export default function HeaderBar() {
  const { isDark, lang, collapsed, setLang, toggleDark, toggleCollapsed } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const topNav = [
    { key: "overview", icon: "layout-dashboard", label: t("nav.overview") },
    { key: "strategy", icon: "scroll-text", label: t("nav.strategy") },
    { key: "device", icon: "network", label: t("nav.device") },
    { key: "alarm", icon: "bell", label: t("nav.alarm") },
    { key: "report", icon: "chart-column", label: t("nav.report") },
  ];

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <IconButton
          iconName={<Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size={16} />}
          tipText={t("nav.toggleSider")}
          size="small"
          onClick={toggleCollapsed}
        />
        <span className="header-bar__logo">
          <Icon name="shield-check" size={18} />
        </span>
        <span className="header-bar__names">
          <strong className="header-bar__title">{t("app.name")}</strong>
          <span className="header-bar__sub">{t("app.brandSub")}</span>
        </span>
      </div>

      {/* TODO(eview-react): Menu 无对应组件，手写水平导航 */}
      <nav className="header-bar__nav">
        {topNav.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`header-bar__nav-item${item.key === "strategy" ? " is-active" : ""}`}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        {/* TODO(eview-react): TextField 无 prefix/allowClear，搜索图标暂省略 */}
        <TextField
          className="header-bar__search"
          placeholder={t("top.search")}
          value=""
          onChange={() => {}}
        />

        {/* TODO(eview-react): Segmented 无对应组件，手写语言切换 */}
        <div className="app-segmented app-segmented--sm">
          {[
            { label: "中", value: "zh" },
            { label: "EN", value: "en" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`app-segmented__item${lang === opt.value ? " is-active" : ""}`}
              onClick={() => setLang(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <IconButton
          iconName={<Icon name={isDark ? "sun" : "moon"} size={16} />}
          tipText={isDark ? t("top.theme.toLight") : t("top.theme.toDark")}
          onClick={toggleDark}
        />

        <Badge content={6}>
          <IconButton iconName={<Icon name="bell" size={16} />} tipText={t("top.notify")} />
        </Badge>

        <IconButton iconName={<Icon name="circle-question-mark" size={16} />} tipText={t("top.help")} />

        <div className="header-bar__divider" />

        <div className="header-bar__user">
          <img className="header-bar__avatar" src="/uploads/user.png" alt="" />
          <span className="header-bar__user-text">
            <strong>{lang === "zh" ? "李伟" : "Li Wei"}</strong>
            <em>
              <FormattedMessage id="top.role" defaultMessage="网络运维管理员" />
            </em>
          </span>
        </div>

        <IconButton iconName={<Icon name="log-out" size={16} />} tipText={t("top.logout")} />
      </div>
    </header>
  );
}
