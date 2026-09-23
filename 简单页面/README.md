# 数据指标管理 — eview-react 迁移产物

本目录是把源项目（`index.page.html` UMD 单 HTML 工程，基于 antd）迁移到 **@nce/eview-react (ICT 3.1)** 的产物。

## 目录结构

```
eview/
├── package.json          # 依赖含 @nce/eview-react 等（华为内网源）
├── .npmrc                # @nce scope → cmc.centralrepo.rnd.huawei.com
├── vite.config.js        # Vite + @vitejs/plugin-react
├── index.html            # <body class="ev_no_wcag aui3_1"> + /src/main.jsx
├── public/
│   ├── font/HarmonyOS_SansSC/*.woff2   # HarmonyOS Sans SC 字体
│   └── uploads/                        # user.png / favicon.svg
└── src/
    ├── main.jsx          # ConfigProvider + IntlProvider(locale="zh") + 六处 CSS import
    ├── app.jsx           # AppShell：AppProvider + 布局壳
    ├── context.jsx       # 全局状态（主题/指标/筛选/选择/编辑器），暗色双轨切换
    ├── mock/metrics.js   # 指标域 mock + 字典 + 派生计算
    ├── shared/icon.jsx   # 离线 Lucide 图标（无网络依赖）
    ├── components/       # panel-card / status-tag / category-chip / ratio-value / action-menu
    ├── views/            # header-bar / page-heading / metric-filter / metric-table / metric-editor
    └── styles/
        ├── base.css      # 全局重置 + body/滚动条 + rem 基准
        ├── font.css      # @font-face（HarmonyOS Sans）
        ├── tokens.css    # 源项目原始 token（light）
        ├── theme-dark.css# 源项目 .dark token 覆盖
        └── app.css       # 业务布局 CSS + 手写补位组件样式
```

## 运行（需华为内网 / VPN）

> ⚠️ **外网限制**：`@nce/eview-react` 及 peer 依赖托管在华为内网 npm 源（`.npmrc` 已配置 `cmc.centralrepo.rnd.huawei.com`）。
> 外网无法 `npm install`。请在接入内网/VPN 的环境执行：

```bash
cd eview
npm install        # 需内网可达
npm run dev        # http://localhost:5173
npm run build      # 产物 dist/
```

## 外网下的两项适配

1. **图标离线化**：源项目 `icon.jsx` 走 icon-plus 在线（`octo.hdesign.huawei.com`），外网不可达。
   本工程 `src/shared/icon.jsx` 改为**纯离线 Lucide SVG 节点表**渲染，`<Icon name="..." />` 契约不变，无任何网络请求。
   图标节点已内联，如需新增图标，从 lucide 取同形节点追加到 `LUCIDE` 表即可。
   （内网若想切回 icon-plus 静态 import，按 skill `source-project-guidelines.md` §3.3 逐个查名替换。）

2. **依赖安装**：见上，必须内网执行 `npm install`。

## 关键迁移点

| antd | eview-react | 说明 |
|------|-------------|------|
| `ConfigProvider locale={zhCN}` | `ConfigProvider` + `IntlProvider locale="zh"` | 在 `main.jsx`，IntlProvider 为 ConfigProvider 直接子级 |
| `Input`（搜索/前缀/回车） | `SearchInput` | onChange(value) 非 event；onSearch 触发查询 |
| `Input` / `Input.TextArea` / `InputNumber` | `TextField` / `TextArea` / `Spinner` | Form 内不传 value/onChange，由 Form 托管 |
| `Select` options `{value,label}` | `Select` options `{value,text}` | `allowClear`→`enableClear`，`placeholder`→`defaultLabel` |
| `Switch` | `Toggle` | `checked`→`toggled`，`onChange`→`onToggle`，`data=[false,true]` |
| `Tooltip` | `TipBox` | 包裹式，`title`→`content`，`placement`→`direction` |
| `Table` dataSource/rowKey/dataIndex | `Table` dataset/columns.key/keyIndex | 对象行 + 隐藏 id 列 + keyIndex=0；前台分页 enableAutoPaging |
| `Table rowSelection` | `enableCheckBox`/`checkedRows`/`onRowCheck` | disableCheckboxIds 禁勾 offline 行 |
| `Modal.confirm` | `MessageDialog type="confirm"` | isOpen 受控，buttons 对象 |
| `message.success` | `DivMessage` | 无命令式 API，渲染 + display + key 重挂 |
| `Form.useForm` + `validateFields` | `useRef` + `ref.submit()`→`onSuccess` | 控制流同步变异步 |
| `Form` 多列 div/Row/Col | `Form itemCol={12}` + `Form.Item col={24}` | 硬约束：Form 内不允许 div 做栅格 |
| `Drawer open/footer` | `Drawer visible` + 自写底部栏 | destroyOnClose，isClickMask={false} |
| `Button type/icon/shape` | `Button status/text/leftIcon` | 图标按钮（无 IconButton）手写 `app-icon-btn` |
| `Dropdown` + `Menu` | 手写 `ActionMenu` | eview 无 Dropdown 对应组件 |

## 已知限制 / 待内网验证

- **Table 冻结列**：源项目 `fixed: 'left'/'right'`（指标名称 / 操作列冻结）未迁移——eview `freezeCol`+`freezeColPosition` 的左右定位未在 Reference 中明确，为避免写入未验证 API 而省略；表格超宽时整体横向滚动，名称与操作列不再常驻。内网可按 `Table.md` §5 `freezeCol` 补回。
- **Form `itemCol` 在 `layout="vertical"` 下的生效情况**：Reference 多列示例基于 horizontal；vertical + itemCol={12} 为合理推断，若内网真机发现未生效，表单退化为单列（功能不受影响）。
- **`validateAllChildComponent`**：未使用（该 API 标注"待实测"）。指标编码的格式校验通过 `TextField validator` 在用户交互时触发，提交时不再二次校验。
- **单页多个 `status="primary"`**：源项目原有"新建指标 / 查询 / 保存"三个主按钮，保留原语义。eview README 建议"单页一个 primary"为软性约定，非 API 硬限制，按需可把"查询"改为次按钮。

## 静态检查（已通过）

- 相对导入解析：`src/` 下无残留 `./src/...`，所有相对 import 均指向真实文件。
- antd 残留：无 `from 'antd'` / `Form.useForm` / `Modal.confirm` / `message.*` / `type="primary"` / `shape="circle"` / `allowClear` / `onPressEnter` / `dataIndex` / `rowKey` / `dataSource`。
- i18n 动态 key：本项目全中文直出，无 `t()` 调用，N/A。
