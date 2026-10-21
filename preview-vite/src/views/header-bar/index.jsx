// 顶部栏 — 标题 + 主题切换
import Button from "@nce/eview-react/Button";
import { IconPlusIcPublicMoon, IconPlusIcPublicSun, IconPlusIcPublicTag } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import "./index.css";

export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  return (
    <header className="header-bar">
      <div className="header-bar-left">
        <div className="header-bar-badge">
          <IconPlusIcPublicTag iconSize="1.25rem" iconColor={['#0067D1']} />
        </div>
        <div className="header-bar-text">
          <h1 className="header-bar-title">Tag 组件展示</h1>
          <p className="header-bar-subtitle">
            Ant Design 5 标签组件的各类形态、状态与场景演示
          </p>
        </div>
      </div>
      <div className="header-bar-right">
        <Button
          status="default"
          leftIcon={isDark ? <IconPlusIcPublicSun iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="0.875rem" iconColor={['currentcolor']} />}
          text={isDark ? "切换浅色" : "切换深色"}
          onClick={toggleDark}
        />
      </div>
    </header>
  );
}
