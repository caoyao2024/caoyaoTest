// Layer 3 — 表单分区容器

import {
  IconPlusIcDigitalPowerDpUserCluster,
  IconPlusIcIctServers,
  IconPlusIcPublicClipboard,
  IconPlusIcPublicFiles,
  IconPlusIcPublicPaperclip,
  IconPlusIcPublicTelephone,
} from "@nce/icon-plus";
import "./index.css";

// 源项目 FormSection 的 icon prop 传字符串名（Lucide 命名），这里映射到 icon+ 静态组件。
// 调用点（work-order-form 的 6 个 FormSection）传入的 icon 值均为封闭字面量集合。
const ICON_MAP = {
  "clipboard-list": IconPlusIcPublicClipboard,
  "server": IconPlusIcIctServers,
  "file-text": IconPlusIcPublicFiles,
  "users": IconPlusIcDigitalPowerDpUserCluster,
  "paperclip": IconPlusIcPublicPaperclip,
  "phone": IconPlusIcPublicTelephone,
};

export default function FormSection({ index, icon, title, desc, extra, children }) {
  const Ic = ICON_MAP[icon];
  return (
    <section className="form-section">
      <header className="form-section__head">
        <span className="form-section__index">{index}</span>
        <div className="form-section__heading">
          <h3 className="form-section__title">
            {Ic ? <Ic iconSize="1rem" iconColor={["currentcolor"]} className="form-section__icon" /> : null}
            {title}
          </h3>
          {desc ? <p className="form-section__desc">{desc}</p> : null}
        </div>
        {extra ? <div className="form-section__extra">{extra}</div> : null}
      </header>
      <div className="form-section__body">{children}</div>
    </section>
  );
}
