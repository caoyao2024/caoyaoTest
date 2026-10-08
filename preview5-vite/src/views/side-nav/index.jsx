// Layer 4: 侧边导航栏 — eview-react Accordion（分组多级），支持展开/收起
import { useState } from "react";
import Accordion from '@nce/eview-react/Accordion';
import { sideMenuItems } from "../../mock/order.jsx";
import "./index.css";

export default function SideNav({ collapsed }) {
  const [selectedValue, setSelectedValue] = useState("order-create");

  return (
    <aside className={`side-nav${collapsed ? " collapsed" : ""}`}>
      <Accordion
        data={sideMenuItems}
        selectedValue={selectedValue}
        onClick={(node) => {
          if (node && node.value && (!node.children || node.children.length === 0)) {
            setSelectedValue(node.value);
          }
        }}
        enableExpand
        expanded={collapsed}
        onExpand={(flag) => {}}
        hideTitleBar
        enableMultiOpen
        style={{ background: "transparent" }}
      />
    </aside>
  );
}
