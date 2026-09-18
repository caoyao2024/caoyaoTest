# 计划：eview-react 默认使用 icon+ 图标 + 修正图标名映射方案

## Context（背景）

eview-react Skill 在 [Icon.md](d:\60096960\a2ui_genertor\eview-react\references\Icon.md) 散文里把 icon+（`@hui/icon-plus`）标为"首选"，但示例代码几乎全用内置 `Icon name="ict_xxx"`，示范与指引矛盾；兼容组件 Reference（Button/Tab/Steps/Tree/TipBox）也只示范字符串/URL/内置形式。SKILL.md 对 icon+ 默认路径未置一词。

同时，[source-project-guidelines.md](d:\60096960\a2ui_genertor\antd-to-eview-react\references\source-project-guidelines.md) §3 把源项目"运行时 fetch 图标服务"整体判为"方案 C 应避免"，论据是"返回 SVG、给不了 icon+ 组件名、范式不兼容"。**这个判断需要修正**：接口既可吃 Lucide 名也可吃 antd 名做 keyword 查询，eview-react 工程已装 `@hui/icon-plus`，迁移时只需用接口查出 antd/Lucide 名对应的 **icon+ 组件名**，再静态 `import` 即可——fetch 只做迁移期一次的名发现、不参与运行时渲染，范式冲突消除。故"通过接口匹配图标名"应提升为**优选方案**。

本次（用户"修改图标相关内容"第一步）做两件事：①eview-react 默认切 icon+；②修正 source-project-guidelines.md §3 的方案定位。

## 决策记录

- **eview-react 示例的 icon+ 组件名仅为示意**，具体名不影响示例示意；真实 icon+ 名在迁移时靠 getIcon 接口查得（见第二部分）。因此示例用 `IconPlusIcPublic*` 模式的示意名，不加"必须核对"的硬警告，只加一句轻量说明指向接口方案。
- **包名 `@hui/icon-plus` vs `@nce/icon-plus` 保留"待实测"现状**，不强行统一。
- **内置 Icon 定位**：从所有**示例**中彻底删除；API 速查表里的 `Icon.*` 行保留为存量 API 注记，不再作为推荐示范。
- **string-only 图标 prop 的组件**（Rating/Tag/Select/Loading/DivMessage/Crumbs/TreeTable/MessageDialog/Dialog 等）本次不动。

---

## 第一部分：eview-react 默认切 icon+（第一步主体）

### 1. [Icon.md](d:\60096960\a2ui_genertor\eview-react\references\Icon.md)（主改）

- **头部警告（§ 开头 line 5–7）**：保留"官网首推 icon+""包名待实测""可点击图标用 IconButton 不要给 Icon 挂 onClick"三条；补一句"下文示例统一用 icon+，内置 `Icon name=` 不再示范，仅 API 表留存；真实 icon+ 名迁移时用 getIcon 接口查得，示例名为示意"。
- **§1 功能定位表（line 15）**："icon+ 组件（首选）或 Icon name" → "icon+ 组件"。
- **§4「icon+ 图标（首选）」小节（line 36–42）**：保留为唯一装饰性图标示范，扩充一两个常用图标。
- **§4「内置 Icon」小节（line 44–50）**：**删除整段**。
- **§4 IconButton 小节（line 52–58）**：`iconName="ict_edit"` → `iconName={<IconPlusIcPublicEdit />}`，`iconName="ict_tips"` → icon+ 形式；line 56 已用 icon+ 保留。删掉暗示 string 是主路径的注释。
- **§7 完整代码示例（line 82–128）**：全量改 icon+——删 `import Icon`（line 85），加 `import { IconPlusIcPublicCheck, IconPlusIcPublicAbout, IconPlusIcPublicEdit, IconPlusIcPublicRefresh, IconPlusIcPublicTrash } from '@hui/icon-plus'`；line 109 状态图标改 icon+；line 113/115/119 `IconButton iconName="ict_*"` → `iconName={<IconPlusIcPublic* />}`。
- **§8 反面示例（line 130–147）**：删两条内置 Icon 反例（line 137、140）；保留 antd 图标库反例（134）、icon+ 尺寸反例（143）、IconButton tipText+tipContent 反例（146）；补一条"不要再用内置 `Icon name=`，改用 icon+"。
- **§9 API 速查（line 149–171）**：`Icon.*` 行（155–162）加前缀"内置 Icon，存量 API，不再推荐示范"；IconButton 与 icon+ 行保留。

### 2. [SKILL.md](d:\60096960\a2ui_genertor\eview-react\SKILL.md)

- 「必须遵守」节（line 28 起）导入规则后补一条：**"图标默认用 icon+（`import { IconPlusIc* } from '@hui/icon-plus'` 按需引入），示例不用内置 `Icon name='ict_…'`；可点击图标用 `IconButton iconName={<IconPlus* />}`。包名 `@hui` vs `@nce` 待实测。"**

### 3. [TipBox.md](d:\60096960\a2ui_genertor\eview-react\references\TipBox.md)

- §4 line 39 `<Icon name="ict_questionmarkCircle" />` → `<IconPlusIcPublicQuestion />`。
- §7 line 74 删 `import Icon`，加 `import { IconPlusIcPublicQuestion } from '@hui/icon-plus'`；line 86 同步。
- §8 line 116 反例里的 `<Icon />`（antd Tooltip 不可用）保留，**可选**。

### 4. [Button.md](d:\60096960\a2ui_genertor\eview-react\references\Button.md)

- §4 末尾补 icon+ 示范：`<Button status="primary" text="保存" leftIcon={<IconPlusIcPublicSave />} />` / `<Button text="下一步" rightIcon={<IconPlusIcPublicArrowRight />} />`，配 import。

### 5. [Tab.md](d:\60096960\a2ui_genertor\eview-react\references\Tab.md)

- §4 line 87 `icon="./image/home-default.svg"` → `icon={<IconPlusIcPublicHome />}`，补 import。

### 6. [Steps.md](d:\60096960\a2ui_genertor\eview-react\references\Steps.md)

- §4/§5 补 `Item.iconUrl` icon+ 示范：`{ text:'基本信息', value:'1', iconUrl:<IconPlusIcPublicConfig /> }`，补 import。

### 7. [Tree.md](d:\60096960\a2ui_genertor\eview-react\references\Tree.md)

- §4/§5 补三态图标 icon+ 示范：`iconLeaf={<IconPlusIcPublicFile />} iconExpanded={<IconPlusIcPublicFolderOpen />} iconCollapsed={<IconPlusIcPublicFolder />}`，补 import。

---

## 第二部分：修正 source-project-guidelines.md §3 图标方案定位

文件：[source-project-guidelines.md](d:\60096960\a2ui_genertor\antd-to-eview-react\references\source-project-guidelines.md)，§3「图标方案应避免运行时 fetch」（line 168 起）。

### 修正要点

§3 标题与论述把"运行时 fetch"整体判为应避免，需拆成两层重新定位：

- **接口的名发现能力 = 优选**：`getIconInfo?keyword=xxx` 接受 Lucide 名或 antd 名做 keyword，返回匹配的 icon+ 图标信息（含 icon+ 名/URL）。迁移时用它查 antd/Lucide 名 → icon+ 组件名，再在 eview-react 工程（已装 `@hui/icon-plus`）里 `import { IconPlusIcXxx } from '@hui/icon-plus'` 静态用。
- **运行时 SVG 注入旁路 = 应避免**：仅指源项目那条"fetch SVG → `dangerouslySetInnerHTML` 注入 DOM"的渲染旁路（依赖内网 `octo.hdesign.huawei.com`、离线不可用、绕过 eview-react 图标体系）。

### 具体改动

- **§3 标题（line 168）**：`## 3. 图标方案应避免运行时 fetch` → `## 3. 图标方案：用接口匹配 icon+ 名（优选），避免运行时 fetch SVG 注入`。
- **§3.1 问题（line 170–212）**：保留对源项目 `icons.js` 三层结构的客观描述（硬编码 Lucide path / 运行时 fetch / 缓存）。这是事实，不动。
- **§3.2 迁移时的影响 / 问题 1–3（line 214–255）**：
  - **问题 1（line 229）「不知道图标名怎么映射」**：改为"可解"——接口可按 antd 或 Lucide 名 keyword 查到 icon+ 名；删去"skill 里只有少数例子、无法确认"的绝对化结论，改为"迁移时用 getIconInfo 接口查得，见 §3.3 优选方案"。
  - **问题 2（line 237）「范式不兼容」**：保留对"运行时 fetch SVG 注入"的判断；补一句"但接口能力可复用为迁移期名发现，不参与运行时渲染，范式冲突消除"。
  - **问题 3（line 246）「最终只能退化方案」**：改写——之前因问题 1+2 退化去图标是无奈之举；现在有了接口名发现优选方案，不必再"丢失所有视觉图标"，可保留图标。
- **§3.3 建议方案（line 257–304）**：重排为：
  - **优选方案：用 icon-plus 接口做名映射，迁到 eview-react icon+ 组件**——按 antd/Lucide 名 keyword 查 `getIconInfo`，拿 icon+ 名，`import { IconPlusIcXxx } from '@hui/icon-plus'` 静态用；接口仅迁移期一次名发现，不运行时渲染。补一张"antd/Lucide 名 → icon+ 名"的查询示意表（名标示意，真实值靠接口）。
  - 方案 A（直接用 `@ant-design/icons`）：降为**备选**——antd 名公开可查、可推断 intent，作为接口不可用时的兜底。
  - 方案 B（内联 SVG）：**备选**——不需映射，`Icon iconUrl` 或内联组件。
  - 方案 C（运行时 fetch SVG 注入）：**应避免**——明确仅指 SVG 注入渲染旁路，接口名发现能力已被优选方案复用。
- **§3.4 成本对比（line 306–313）**：更新表格，新增"接口名发现"列并标为优选（低成本、保留图标、契合 eview-react 静态 import）。

### 不动（第二部分）

- `antd-to-eview-react/SKILL.md` line 112 与 `component-mapping.md` line 104–106 的图标映射总表行：内容仍准确（icon+ 按需引入、`ict_*` 内置、`Icon name` 改色 `isStandard={false}`），本次不改；如需补一句"icon+ 名靠接口查得"可作后续。

---

## 验证

文档型 Skill，无单测/构建。验证方式：

1. **eview-react 正例零残留**：Grep `Icon name="ict_` / `iconName="ict_` / `import Icon from '@nce/eview-react/Icon'` 于 `eview-react/references/`，Icon.md/TipBox/Button/Tab/Steps/Tree 正例中应零命中；残留只允许在 string-only 组件（Rating/Tag/Select/Loading/DivMessage/Crumbs/TreeTable）与反例。
2. **icon+ 正例覆盖**：Grep `IconPlusIc` 在 Icon/TipBox/Button/Tab/Steps/Tree 六个文件都有正例命中。
3. **SKILL.md 命中**：Grep `icon-plus` 在 eview-react/SKILL.md 命中新加默认规则。
4. **source-project-guidelines §3 定位**：通读 §3.3，"优选方案"是接口名发现，方案 C 仅指 SVG 注入旁路、标应避免；问题 1/3 不再是"无解/退化"。
5. **人眼通读**：Icon.md §4/§7/§8、TipBox §4/§7 示例自洽，import 配对（删 `import Icon` 则不再出现 `<Icon`）。
