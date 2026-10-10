// Layer 4: 侧边导航栏 — Accordion（分组多级），支持展开/收起
import { useMemo, useState } from "react";
import Accordion from "@nce/eview-react/Accordion";
import { sideMenuItems } from "../../mock/order.jsx";
import "./index.css";

// 仅一级菜单带图标，二级菜单不带图标
function toAccordionData(list, depth = 0) {
  return list.map((it) => ({
    title: it.label,
    value: it.key,
    icon: depth === 0 ? it.icon : undefined,
    children: it.children ? toAccordionData(it.children, depth + 1) : undefined,
  }));
}

export default function SideNav({ collapsed }) {
  const menuData = useMemo(() => toAccordionData(sideMenuItems), []);
  const [selectedValue, setSelectedValue] = useState("order-create");

  return (
    <aside className={`side-nav${collapsed ? " collapsed" : ""}`}>
      <Accordion
        data={menuData}
        selectedValue={selectedValue}
        onClick={(node) => {
          if (node.value) setSelectedValue(node.value);
        }}
        expanded={collapsed}
        onExpand={() => {}}
        hideTitleBar
        style={{ background: "transparent" }}
      />
    </aside>
  );
}
