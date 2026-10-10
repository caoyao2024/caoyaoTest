// Layer 4: 侧边导航栏 — Accordion（分组多级），支持展开/收起
import { useMemo, useState } from "react";
import Accordion from "@nce/eview-react/Accordion";
import { sideMenuItems } from "../../mock/order.jsx";
import "./index.css";

function toAccordionData(list, depth = 0) {
  return list.map((it) => ({
    value: it.key,
    icon: depth === 0 ? it.icon : undefined,
    title: it.label,
    children: it.children ? toAccordionData(it.children, depth + 1) : undefined,
  }));
}

export default function SideNav({ collapsed }) {
  const data = useMemo(() => toAccordionData(sideMenuItems), []);
  const [selectedValue, setSelectedValue] = useState("order-create");

  return (
    <aside className={`side-nav${collapsed ? " collapsed" : ""}`}>
      <Accordion
        data={data}
        selectedValue={selectedValue}
        onClick={(node) => {
          if (node && node.value) setSelectedValue(node.value);
        }}
        expanded={collapsed}
        enableMultiOpen
        keepExpandState
        hideTitleBar
        hideIcons
        enableExpand={false}
        style={{ background: "transparent" }}
      />
    </aside>
  );
}
