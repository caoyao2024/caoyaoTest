import IconButton from "@nce/eview-react/IconButton";
import { IconPlusIcHuaweiCloudNetwork, IconPlusIcIctLogOut, IconPlusIcPublicBellClock, IconPlusIcPublicChart, IconPlusIcPublicDashboard, IconPlusIcPublicTransverseRectangleTemplate } from '@nce/icon-plus';
import SearchInput from "@nce/eview-react/SearchInput";
import SelectCard from "@nce/eview-react/SelectCard";
import Badge from "@nce/eview-react/Badge";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

export default function HeaderBar() {
  const { isDark, lang, collapsed, setLang, toggleDark, toggleCollapsed } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const topNav = [
    { key: "overview", icon: <IconPlusIcPublicDashboard iconSize={16} iconColor={['currentcolor']} />, label: t("nav.overview") },
    { key: "strategy", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />, label: t("nav.strategy") },
    { key: "device", icon: <IconPlusIcHuaweiCloudNetwork iconSize={16} iconColor={['currentcolor']} />, label: t("nav.device") },
    { key: "alarm", icon: <IconPlusIcPublicBellClock iconSize={16} iconColor={['currentcolor']} />, label: t("nav.alarm") },
    { key: "report", icon: <IconPlusIcPublicChart iconSize={16} iconColor={['currentcolor']} />, label: t("nav.report") },
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
          <IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />
        </span>
        <span className="header-bar__names">
          <strong className="header-bar__title">{t("app.name")}</strong>
          <span className="header-bar__sub">{t("app.brandSub")}</span>
        </span>
      </div>

      <nav className="header-bar__nav">
        {topNav.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`header-bar__nav-item${item.key === "strategy" ? " active" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <SearchInput
          className="header-bar__search"
          placeholder={t("top.search")}
          onClear={() => {}}
        />

        <SelectCard
          type="small"
          className="header-bar__lang"
          value={lang}
          onChange={(value) => setLang(value)}
          data={[
            { text: "中", value: "zh" },
            { text: "EN", value: "en" },
          ]}
        />

        <IconButton
          iconName={<Icon name={isDark ? "sun" : "moon"} size={16} />}
          tipText={isDark ? t("top.theme.toLight") : t("top.theme.toDark")}
          onClick={toggleDark}
        />

        <Badge content={6} offset={[-2, 2]}>
          <IconButton
            iconName={<IconPlusIcPublicBellClock iconSize={16} iconColor={['currentcolor']} />}
            tipText={t("top.notify")}
            onClick={() => {}}
          />
        </Badge>

        <IconButton
          iconName={<IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={['currentcolor']} />}
          tipText={t("top.help")}
          onClick={() => {}}
        />

        <div className="header-bar__divider" />

        <div className="header-bar__user">
          <img className="header-bar__avatar" src="/assets/uploads/user.png" alt="" />
          <span className="header-bar__user-text">
            <strong>{lang === "zh" ? "李伟" : "Li Wei"}</strong>
            <em>
              <FormattedMessage id="top.role" defaultMessage="网络运维管理员" />
            </em>
          </span>
        </div>

        <IconButton
          iconName={<IconPlusIcIctLogOut iconSize={16} iconColor={['currentcolor']} />}
          tipText={t("top.logout")}
          onClick={() => {}}
        />
      </div>
    </header>
  );
}
