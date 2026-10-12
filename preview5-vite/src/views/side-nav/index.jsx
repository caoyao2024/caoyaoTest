// Layer 4: 侧边导航栏 — Accordion（分组多级），支持展开/收起
import { useMemo, useState } from "react";
import Accordion from "@nce/eview-react/Accordion";
import Icon from "@/shared/Icon";
import { sideMenuItems } from "../../mock/order.jsx";
import "./index.css";

const INITIAL_OPEN_KEYS = new Set(["grp-order", "grp-ticket"]);

// 仅一级菜单带图标，二级菜单不带图标
function toAccordionData(list, depth = 0) {
  return list.map((it) => ({
    value: it.key,
    icon: depth === 0 ? <Icon name={it.icon} size="1rem" /> : undefined,
    title: it.label,
    isExpand: depth === 0 && INITIAL_OPEN_KEYS.has(it.key),
    children: it.children ? toAccordionData(it.children, depth + 1) : undefined,
  }));
}

function isLeaf(node) {
  return !node.children || node.children.length === 0;
}

export default function SideNav({ collapsed }) {
  const data = useMemo(() => toAccordionData(sideMenuItems), []);
  const [selectedValue, setSelectedValue] = useState("order-create");

  const handleMenuClick = (node) => {
    if (isLeaf(node) && node.value) {
      setSelectedValue(node.value);
    }
  };

  return (
    <aside className={`side-nav${collapsed ? " collapsed" : ""}`}>
      <Accordion
        data={data}
        selectedValue={selectedValue}
        onClick={handleMenuClick}
        expanded={collapsed}
        onExpand={() => {}}
        enableMultiOpen
        style={{ background: "transparent" }}
      />
    </aside>
  );
}
