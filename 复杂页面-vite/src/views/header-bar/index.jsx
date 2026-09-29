import IconButton from "@nce/eview-react/IconButton";
import SearchInput from "@nce/eview-react/SearchInput";
import SelectCard from "@nce/eview-react/SelectCard";
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import {
  IconPlusIcPublicTransverseRectangleTemplate,
  IconPlusIcPublicBellClock,
  IconPlusIcIctLogOut,
} from "@nce/icon-plus";
import { FormattedMessage, useIntl } from "react-intl";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 顶部导航栏 — 品牌 / 全局导航 / 国际化切换 / 明暗切换 / 用户区
// Menu 无对应组件，手写为 nav > button 列表（见 handwrite-templates §5）
export default function HeaderBar() {
  const { isDark, lang, collapsed, setLang, toggleDark, toggleCollapsed } = useApp();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const topNav = [
    { key: "overview", label: t("nav.overview") },
    { key: "strategy", label: t("nav.strategy") },
    { key: "device", label: t("nav.device") },
    { key: "alarm", label: t("nav.alarm") },
    { key: "report", label: t("nav.report") },
  ];

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <TipBox content={t("nav.toggleSider")} direction="bottom">
          <IconButton
            iconName={<IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} />}
            tipText={t("nav.toggleSider")}
            size="small"
            onClick={toggleCollapsed}
          />
        </TipBox>
        <span className="header-bar__logo">
          <IconPlusIcPublicTransverseRectangleTemplate iconSize={18} iconColor={["currentcolor"]} />
        </span>
        <span className="header-bar__names">
          <strong className="header-bar__title">{t("app.name")}</strong>
          <span className="header-bar__sub">
            {lang === "zh" ? t("app.brandSub") : t("app.brandSub")}
          </span>
        </span>
      </div>

      <nav className="header-bar__nav">
        {topNav.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`header-bar__nav-item${item.key === "strategy" ? " active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-bar__tools">
        <SearchInput
          className="header-bar__search"
          placeholder={t("top.search")}
          onSearch={() => {}}
          onClear={() => {}}
        />

        <TipBox content={t("top.lang")} direction="bottom">
          <SelectCard
            type="small"
            data={[
              { text: "中", value: "zh" },
              { text: "EN", value: "en" },
            ]}
            value={lang}
            onChange={(value) => setLang(value)}
          />
        </TipBox>

        <TipBox content={isDark ? t("top.theme.toLight") : t("top.theme.toDark")} direction="bottom">
          <IconButton
            iconName={<IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} />}
            tipText={isDark ? t("top.theme.toLight") : t("top.theme.toDark")}
            onClick={toggleDark}
          />
        </TipBox>

        <TipBox content={t("top.notify")} direction="bottom">
          <Badge content={6}>
            <IconButton
              iconName={<IconPlusIcPublicBellClock iconSize={16} iconColor={["currentcolor"]} />}
              tipText={t("top.notify")}
            />
          </Badge>
        </TipBox>

        <TipBox content={t("top.help")} direction="bottom">
          <IconButton
            iconName={<IconPlusIcPublicTransverseRectangleTemplate iconSize={16} iconColor={["currentcolor"]} />}
            tipText={t("top.help")}
          />
        </TipBox>

        <div className="header-bar__divider" />

        <div className="header-bar__user">
          <img className="header-bar__avatar" src="./assets/uploads/user.png" alt="" />
          <span className="header-bar__user-text">
            <strong>{lang === "zh" ? "李伟" : "Li Wei"}</strong>
            <em>
              <FormattedMessage id="top.role" defaultMessage="网络运维管理员" />
            </em>
          </span>
        </div>

        <TipBox content={t("top.logout")} direction="bottom">
          <IconButton
            iconName={<IconPlusIcIctLogOut iconSize={16} iconColor={["currentcolor"]} />}
            tipText={t("top.logout")}
          />
        </TipBox>
      </div>
    </header>
  );
}
