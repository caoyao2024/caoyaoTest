# 计划：eview-react 图标全部由 icon+ 替代 + 修正图标名映射方案

## Context（背景）

eview-react Skill 在 [Icon.md](d:\60096960\a2ui_genertor\eview-react\references\Icon.md) 散文里把 icon+（`@hui/icon-plus`）标为"首选"，但示例代码几乎全用内置 `Icon name="ict_xxx"`，示范与指引矛盾；其它组件的图标 prop 也都示范 `ict_*` 字符串/URL 形式。SKILL.md 对 icon+ 默认路径未置一词。

用户要求：**eview-react 中的 icon 组件应全部由 icon+ 替代**——内置 `Icon` 组件（`@nce/eview-react/Icon`）整体从文档撤掉，所有图标 prop 的示例都改用 icon+ 组件。经确认，现文档标注为 string-only 的图标 prop（Rating/Tag/Select/Loading/DivMessage/Crumbs/TreeTable）**实际都能收 ReactElement**，文档不全，一并更正为 `string | ReactElement`。

同时修正 [source-project-guidelines.md](d:\60096960\a2ui_genertor\antd-to-eview-react\references\source-project-guidelines.md) §3：源项目"运行时 fetch 图标服务"被整体判为"应避免"不对——接口可吃 Lucide 或 antd 名做 keyword 查询返回 icon+ 名，迁移时用它做一次名发现、不参与运行时渲染，范式冲突消除，应提升为**优选方案**；只有"fetch SVG → `dangerouslySetInnerHTML` 注入 DOM"的渲染旁路才应避免。

## 决策记录

- **内置 Icon 组件整体撤出文档**：Icon.md 不再示范 `<Icon name="ict_*">`，API 表删除 `Icon.*` 行，仅留一行"内置 Icon 已被 icon+ 替代、不再推荐"脚注。
- **所有图标 prop 示例改 icon+**：含此前 string-only 的 Rating/Tag/Select/Loading/DivMessage/Crumbs/TreeTable，API 表类型更正为 `string | ReactElement`（TreeTable 三态图标用 `string | ReactNode` 与 Tree 对齐）。
- **示例 icon+ 组件名仅为示意**，具体名不影响示意；真实 icon+ 名迁移时用 getIcon 接口查得（见第三部分）。
- **包名 `@hui/icon-plus` vs `@nce/icon-plus` 保留"待实测"现状**。
- **IconButton 保留**（它是按钮，用 `iconName={<IconPlus*/>}` 走 icon+）。

---

## 第一部分：eview-react 图标全部由 icon+ 替代

### A. [Icon.md](d:\60096960\a2ui_genertor\eview-react\references\Icon.md)（主改，内置 Icon 整体撤掉）

- **头部警告（line 5–7）**：保留"官网首推 icon+""包名待实测""可点击图标用 IconButton 不要给 Icon 挂 onClick"三条；补一句"内置 `Icon name=` 组件已被 icon+ 替代、不再推荐；下文示例统一用 icon+，真实 icon+ 名迁移时用 getIcon 接口查得，示例名为示意"。
- **§1 功能定位表（line 15）**："icon+ 组件（首选）或 Icon name" → "icon+ 组件"。
- **§4「icon+ 图标（首选）」小节（line 36–42）**：保留为唯一装饰性图标示范，扩充常用图标。
- **§4「内置 Icon」小节（line 44–50）**：**删除整段**。
- **§4 IconButton 小节（line 52–58）**：`iconName="ict_edit"` → `iconName={<IconPlusIcPublicEdit />}`；`iconName="ict_tips"` → icon+ 形式；line 56 已用 icon+ 保留。
- **§7 完整代码示例（line 82–128）**：全量改 icon+——删 `import Icon`（line 85），加 `import { IconPlusIcPublicCheck, IconPlusIcPublicAbout, IconPlusIcPublicEdit, IconPlusIcPublicRefresh, IconPlusIcPublicTrash } from '@hui/icon-plus'`；line 109 状态图标改 icon+；line 113/115/119 `IconButton iconName="ict_*"` → `iconName={<IconPlusIcPublic* />}`。
- **§8 反面示例（line 130–147）**：删两条内置 Icon 反例（line 137、140）；保留 antd 图标库反例（134）、icon+ 尺寸反例（143）、IconButton tipText+tipContent 反例（146）；补一条"不要再用内置 `Icon name=`，改用 icon+"。
- **§9 API 速查（line 149–171）**：**删除 `Icon.*` 行（line 155–162）**，留一行脚注"内置 Icon 组件已被 icon+ 替代、不再推荐"；保留 `IconButton.*` 与 icon+ 行。

### B. [SKILL.md](d:\60096960\a2ui_genertor\eview-react\SKILL.md)

- 「必须遵守」节（line 28 起）导入规则后补一条：**"图标默认用 icon+（`import { IconPlusIc* } from '@hui/icon-plus'` 按需引入），不用内置 `Icon name='ict_…'`；可点击图标用 `IconButton iconName={<IconPlus* />}`。包名 `@hui` vs `@nce` 待实测。"**
- 组件索引 line 80 行："Icon / IconButton / 图标 / icon+" → "IconButton / 图标 / icon+"（内置 Icon 不再单列）。

### C. 已 icon+-兼容组件：示例补 icon+（API 表本就标 ReactElement）

- **[TipBox.md](d:\60096960\a2ui_genertor\eview-react\references\TipBox.md)**：§4 line 39 与 §7 line 86 `<Icon name="ict_questionmarkCircle" />` → `<IconPlusIcPublicQuestion />`；§7 line 74 删 `import Icon`，加 `import { IconPlusIcPublicQuestion } from '@hui/icon-plus'`。
- **[Button.md](d:\60096960\a2ui_genertor\eview-react\references\Button.md)**：§4 末尾补 `<Button status="primary" text="保存" leftIcon={<IconPlusIcPublicSave />} />` / `<Button text="下一步" rightIcon={<IconPlusIcPublicArrowRight />} />` + import。
- **[Tab.md](d:\60096960\a2ui_genertor\eview-react\references\Tab.md)**：§4 line 87 `icon="./image/home-default.svg"` → `icon={<IconPlusIcPublicHome />}` + import。
- **[Steps.md](d:\60096960\a2ui_genertor\eview-react\references\Steps.md)**：§4/§5 补 `iconUrl: <IconPlusIcPublicConfig />` 示例 + import。
- **[Tree.md](d:\60096960\a2ui_genertor\eview-react\references\Tree.md)**：§4/§5 补 `iconLeaf={<IconPlusIcPublicFile />} iconExpanded={<IconPlusIcPublicFolderOpen />} iconCollapsed={<IconPlusIcPublicFolder />}` + import。
- **[Empty.md](d:\60096960\a2ui_genertor\eview-react\references\Empty.md)**：line 46 已用 icon+，无需改。

### D. 此前 string-only 图标 prop：示例改 icon+ + API 表类型更正

> 模式：把示例里的 `"ict_*"` / URL 字符串改成 `<IconPlusIcPublic* />`，加 import；API 表对应行类型 `string` → `string | ReactElement`（TreeTable 三态用 `string | ReactNode`）。icon+ 组件名为示意。

- **[Rating.md](d:\60096960\a2ui_genertor\eview-react\references\Rating.md)**：§4 line 61 `iconName="ict_heart"` → `iconName={<IconPlusIcPublicHeart />}` + import；API line 188 `iconName` 类型 `string` → `string | ReactElement`。
- **[Tag.md](d:\60096960\a2ui_genertor\eview-react\references\Tag.md)**：§4 line 81 `iconName="ict_about"` → `iconName={<IconPlusIcPublicAbout />}` + import；API line 222 `iconName` 类型 `string` → `string | ReactElement`；§8 line 192 反例 `<Tag icon={<Icon />}>` 的 `<Icon />` 换成 `<IconPlusIcPublicXxx />`（仍示 antd `icon=` 不支持）。
- **[Select.md](d:\60096960\a2ui_genertor\eview-react\references\Select.md)**：§5 line 96–97 `icon?: string; iconActive?: string;` → `string | ReactElement`；§4/§5 补 options 项 `icon: <IconPlusIcPublicXxx />` 示例 + import；API line 243 备注更新。
- **[Loading.md](d:\60096960\a2ui_genertor\eview-react\references\Loading.md)**：§4 line 52 `iconUrl="./image/loading.gif"` → `iconUrl={<IconPlusIcPublicLoading />}` + import；API line 178 `iconUrl` 类型 `string` → `string | ReactElement`。
- **[DivMessage.md](d:\60096960\a2ui_genertor\eview-react\references\DivMessage.md)**：§4/§7 补 `icon={<IconPlusIcPublicXxx />}` 示例 + import；API line 163 `icon` 类型 `string` → `string | ReactElement`。
- **[Crumbs.md](d:\60096960\a2ui_genertor\eview-react\references\Crumbs.md)**：§5 line 61 `icon?: string;` → `string | ReactElement`；§4 补 `data[].icon` / `splitIcon` 用 icon+ 示例 + import；API line 143/147 备注更新。
- **[TreeTable.md](d:\60096960\a2ui_genertor\eview-react\references\TreeTable.md)**：API line 196 `iconLeaf / iconExpanded / iconCollapsed` 类型 `string` → `string | ReactNode`（与 Tree 对齐）；§4/§5 补三态 icon+ 示例 + import。

---

## 第二部分：修正 source-project-guidelines.md §3 图标方案定位

文件：[source-project-guidelines.md](d:\60096960\a2ui_genertor\antd-to-eview-react\references\source-project-guidelines.md) §3（line 168 起）。

### 修正要点

把"运行时 fetch"拆两层重新定位：

- **接口名发现 = 优选**：`getIconInfo?keyword=xxx` 吃 Lucide 名或 antd 名，返回匹配 icon+ 图标信息（含 icon+ 名）。迁移时查 antd/Lucide 名 → icon+ 组件名，再在 eview-react 工程（已装 `@hui/icon-plus`）`import { IconPlusIcXxx } from '@hui/icon-plus'` 静态用。fetch 只做迁移期一次名发现、不参与运行时渲染，范式冲突消除。
- **运行时 SVG 注入旁路 = 应避免**：仅指源项目那条"fetch SVG → `dangerouslySetInnerHTML` 注入 DOM"渲染旁路（依赖内网 `octo.hdesign.huawei.com`、离线不可用、绕过 eview-react 图标体系）。

### 具体改动

- **§3 标题（line 168）**：`## 3. 图标方案应避免运行时 fetch` → `## 3. 图标方案：用接口匹配 icon+ 名（优选），避免运行时 fetch SVG 注入`。
- **§3.1（line 170–212）**：源项目 `icons.js` 三层结构客观描述保留，不动。
- **§3.2 问题 1–3（line 214–255）**：
  - 问题 1「不知道图标名怎么映射」→ 改"可解"：接口可按 antd 或 Lucide 名 keyword 查到 icon+ 名，指向 §3.3 优选方案。
  - 问题 2「范式不兼容」→ 保留对 SVG 注入旁路的判断；补一句"接口能力可复用为迁移期名发现，不参与运行时渲染，范式冲突消除"。
  - 问题 3「最终只能退化方案」→ 改写：有了接口名发现优选方案，不必再"丢失所有视觉图标"。
- **§3.3 建议方案（line 257–304）**重排：
  - **优选方案：用 icon-plus 接口做名映射，迁到 eview-react icon+ 组件**——keyword 查 `getIconInfo` 拿 icon+ 名，`import { IconPlusIcXxx } from '@hui/icon-plus'` 静态用；接口仅迁移期一次名发现。补"antd/Lucide 名 → icon+ 名"查询示意表（名标示意，真实值靠接口）。
  - 方案 A（直接用 `@ant-design/icons`）：降为**备选**——antd 名公开可查、可推断 intent，接口不可用时兜底。
  - 方案 B（内联 SVG）：**备选**——不需映射，`Icon iconUrl` 或内联组件。
  - 方案 C（运行时 fetch SVG 注入）：**应避免**——明确仅指 SVG 注入渲染旁路，接口名发现能力已被优选方案复用。
- **§3.4 成本对比（line 306–313）**：新增"接口名发现"列并标优选（低成本、保留图标、契合 eview-react 静态 import）。

---

## 验证

文档型 Skill，无单测/构建。

1. **eview-react 正例零残留**：Grep `Icon name="ict_` / `iconName="ict_` / `import Icon from '@nce/eview-react/Icon'` / `="ict_` 于 `eview-react/references/`，所有正例应零命中（反例里示意性的保留需人眼确认）。
2. **icon+ 正例覆盖**：Grep `IconPlusIc` 命中 Icon/TipBox/Button/Tab/Steps/Tree/Empty/Rating/Tag/Select/Loading/DivMessage/Crumbs/TreeTable 全部。
3. **API 表类型更正**：Grep `string` 上下文，确认 Rating/Tag/Select/Loading/DivMessage/Crumbs 的图标 prop 已标 `string | ReactElement`，TreeTable 三态标 `string | ReactNode`；Icon.md 的 `Icon.*` 行已删。
4. **SKILL.md**：Grep `icon-plus` 命中新默认规则；组件索引行已去 Icon 单列。
5. **source-project-guidelines §3**：通读 §3.3，"优选方案"是接口名发现，方案 C 仅指 SVG 注入旁路、标应避免；问题 1/3 不再"无解/退化"。
6. **人眼通读**：各文件 import 配对（删 `import Icon` 则不再出现 `<Icon`）；示例自洽。
