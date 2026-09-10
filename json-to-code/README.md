# jsonToCode — A2UI → React 代码生成管线

> **jsonToCode** 是一个 TypeScript 代码生成管线，将 A2UI 设计规范 JSON 转换为 React 前端代码。支持多目标组件库（`eview-react`、`eview-ui`，通过 `targetLib` 切换，默认 `eview-react`）。

---

## 1. 项目简介

将 A2UI（设计规范描述格式）JSON 通过一系列步骤（管线）转换为可运行的 React 前端代码。

### 项目定位

- **纯库（library）**：不做任何 IO，只做数据转换
- **可嵌入**：可集成到 Electron 应用（API 模式）或独立调试运行（CLI 模式）
- **声明式映射**：组件转换规则通过映射文件声明，适配新组件库无需改管线代码

### 两种运行模式

| 模式 | 入口 | 数据来源 | 输出 | 用途 |
|------|------|---------|------|------|
| **API 模式** | `api/index.ts` 导出 `downloadHuiCode()` | 内存传入 `Array<{ mergedA2UI, planner }>` | 返回 `{ files: OutputFile[] }` | Electron 集成、服务器调用 |
| **CLI 模式** | `cli.ts` | `pages-source/` 目录下的 JSON 文件 | 写入 `output/` 目录 | 本地开发调试 |

---

## 2. 快速开始

### CLI 模式（本地开发调试）

```bash
# 安装依赖
npm install

# 运行 CLI（读 pages-source/，写入 output/）
npm run dev
# 或
npx tsx cli.ts
```

### API 模式（程序调用）

```ts
import { downloadHuiCode } from './api/index';

const { files } = await downloadHuiCode([
  {
    mergedA2UI: {
      rootId: 'root',
      elements: [/* A2UI 节点数组 */],
      state: { /* 页面状态 */ },
    },
    planner: {
      rootId: 'root',
      elements: [/* planner 节点 */],
      slots: [/* 布局插槽 */],
    },
  },
], {
  targetLib: 'eview-react',
});

// files 可直接传给 desktopApi.exportZip({ defaultName, files })
```

---

## 3. 整体架构

管线 7 步（默认步骤链）：

```
RegisterComponents → BuildTrees → NodeMapper
  → FileGenerator → GenerateRoutes → GenerateReport → WriteOutput
```

| 步骤 | 职责 |
|------|------|
| RegisterComponents | 加载组件映射（MappingDef）到 ComponentRegistry |
| BuildTrees | 建树 + Binding 打标 + ExtractNode 构建 + icon 收集（单次遍历） |
| NodeMapper | 调 registry.transform（纯形状变换，不收集数据） |
| FileGenerator | state-builder 走树消费 + tree-finalizer + **样式提取（tree-finalizer 后）** + jsx-emitter + file-assembler |
| GenerateRoutes | 生成 React Router 路由 |
| GenerateReport | 报告（仅 console.log，不落盘 md） |
| WriteOutput | 收集产出文件清单 |

> 无独立 ReadPages 步骤——`downloadHuiCode` 入口直接做 input → pagesData 转换。
> icon 收集合并在 BuildTrees 内（不再有独立 ResolveIcons 步骤）。
> 无独立 GenerateStyles 步骤——样式提取在 FileGenerator 内、tree-finalizer 之后跑（用 `finalResult.extractedFiles`，已过滤被 mapping 消化/force-inline 的循环模板，避免孤儿 .less）。

### 核心设计原则

- **两分法**：节点体系（`kind`，5 类）和值类体系（`type`，7 类）正交
- **万物都是对象**：children 中无裸字符串，TextNode 显式化
- **渐进填充**：BuildTrees → NodeMapper → FileGenerator，同一节点不断补全
- **三路由**：`ExtractRoute = inline / module-top / component-internal`
- **编译期计算**：ComputedValue.transform 跑在 FileGenerator，不产运行时代码

完整架构、节点/值类体系、state-builder 消费管线、命名规则等详见
[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)。

---

## 4. 核心数据流

```
PipelineContext (ctx)
├── config              配置对象（api/index.ts 内部 config + options 合并）
├── registry            ComponentRegistry 实例
├── targetLib           目标组件库（默认 'eview-react'）
├── pagesData           input → pagesData 形态直接注入（跳过 ReadPages）
│
├── builtPages          [BuildTrees] 建树 + 打标后的页面（含 rootTree/extracts/iconNameMap）
├── mappedPages         [NodeMapper] transform 后的页面
├── styleResults        [FileGenerator] lessFiles（tree-finalizer 后提取）
├── generatedFiles     [FileGenerator] 代码文件
├── routeResult         [GenerateRoutes] 路由文件
├── outputFiles         [WriteOutput] 产出文件列表 [{ path, content }]
└── generationReport    [GenerateReport] 报告内容
```

### 文件单元模型

FileGenerator 阶段按"处理层 + 序列化层 + 文件装配"三层切分：

```
state-builder     → state.js + FileUnit（bindingRefs/computedRefs/jsxLiteralConsts/enrichmentConsts）
tree-finalizer     → FileDraft + PendingExtractedFile（propRoute 提升 + useState lift）
import-collector   → 每文件 ImportMap
jsx-emitter        → BuildNode 树 / PropValue → JSX 字符串
file-assembler     → 拼成 GeneratedFile（index.tsx / modules/ / components/ / state.ts）
```

每个产物文件是一个独立 FileUnit，有自己的 stateRefs / jsxLiteralConsts / enrichmentConsts。
binding/computed 保留原类型，jsx-emitter 直接 emit `accessPath`。

---

## 5. 关键模块

```
api/
├── index.ts                     ← API 入口（downloadHuiCode + 内部 config）
├── config/
│   ├── chartDefaults/           ← 图表默认配置
│   └── mappings/                ← 组件映射（按库名拆子目录）
│       ├── eview-react/         ← 参考实现：工厂 createXxxMapping(pkg)（eview-ui 特例复用）
│       └── eview-ui/            ← 复用 eview-react 28 工厂 + 本地 bespoke（待补）
├── src/
│   ├── core/                    ← 节点/值类/映射/注册中心/图标
│   │   ├── node-types.ts / node.ts          (节点体系 + Node.* 工厂)
│   │   ├── value-types.ts / value.ts        (值类体系 + Value.* 工厂)
│   │   ├── component-mapping.ts             (MappingDef + TransformContext)
│   │   ├── component-registry.ts            (组件注册中心)
│   │   ├── icon-collection.ts / icon-props.ts(图标收集 + API 解析 + resolveIcon)
│   │   ├── scoped-enrichment.ts             (循环 enrichment + render fn 工具)
│   │   ├── access-path.ts                   (accessPath 引用语义：pathToJsAccess/stateRef/...，emit 共用)
│   │   ├── state-path.ts                    (数据路径操作：pathToSegments/resolveBySegments/setNested/parseAccessors，共用)
│   │   ├── file-keys.ts / step.ts           (文件 key 工具 + 步骤基类)
│   ├── pipeline/                ← pipeline.ts + pipeline-context.ts
│   ├── steps/                   ← register-components / build-trees / node-mapper
│   │                              file-generator / generate-routes
│   │                              write-output / generate-report
│   └── codegen/                 ← state-builder / tree-finalizer / import-collector
│                                  jsx-emitter / file-assembler / style-converter
│                                  route-generator / report-generator / js-serializer
└── templates/                   ← Vite 项目模板（index.html / vite.config / App.tsx ...）
```

### 映射文件

每个 A2UI 组件一个映射文件（`api/config/mappings/eview-react/{Component}.ts`），导出**工厂函数** `createXxxMapping(pkg: string)`，用 `` `${pkg}/...` `` 构建 `import`，返回 `MappingDef`：

```ts
export function createAccordionMapping(pkg: string): MappingDef {
  return {
    tag: 'Accordion',                          // 必填：目标组件名
    import: `${pkg}/Accordion`,                 // 必填：导入路径（由 pkg 拼接）
    defaults: { /* 缺省 prop */ },              // 可选
    transform(node, ctx) { /* 形状变换 */ },   // 可选
  }
}
```

`eview-react/index.ts` 声明本地 `const pkg = '@nce/eview-react'` + `export const iconPkg`，调工厂装配。

> **⚠️ 工厂复用是 eview-ui 特例，非通用多库模式**：eview-ui 与 eview-react 基本同一套库（仅包名 + 图标库包名不同），故 `eview-ui/index.ts` 特例复用 eview-react 工厂。未来别的组件库各自独立映射目录、不复用 eview-react 工厂。
>
> eview-ui 映射分三类（详见 [eview-ui/index.ts](api/config/mappings/eview-ui/index.ts) 头注释）：
> - **工厂复用（`pkg='@cloudsop/eview-ui'`）**：23 个组件，eview-ui 包自带。
> - **工厂复用 + `@/shared` 前缀（`sharedPkg='@/shared'`）**：Badge / Divider / Chart——eview-ui 无这些组件，在 `templates/eview-ui/src/shared/` 下手动实现对齐 eview-react API 的公共版本，import 走 `@/shared/<组件>`（vite `@`→src）。Tag 原属此类，已迁移为 bespoke。
> - **bespoke（eview-ui 专属 `MappingDef`）**：DatePicker / Rate / Switch→Toggle / TextArea / Button / Steps / Progress / Dropdown / Tag——eview-ui 与 eview-react API 差异点，独立文件不复用工厂。

映射编写规范见 [docs/LLM-MAPPING-GUIDE.md](./docs/LLM-MAPPING-GUIDE.md)。

---

## 6. 配置

配置统一在 `api/index.ts` 的内部 `config` 对象里手动切换（不走 ESM import，也不读 `config.json`）：

| 字段 | 默认 | 翻 false 后效果 |
|------|------|---------------|
| `config.id` | `true` | 标签不带 `id="..."`（className 不受影响） |
| `config.css` | `true` | 改出 `*.less`（非 `.module.less`），JSX 用字符串 className |
| `config.templateDir` | `'./templates'` | 跨调用方不感知；末尾拼 `/{targetLib}` 子目录；构建后 `./templates` 不存在时回退到 `../../src/excode/templates/{targetLib}`（受保护契约，见 [AGENTS §10](./AGENTS.md)） |

`downloadHuiCode(input, options)` 的 `options` 仅含 `targetLib`。`downloadHuiCode` 内部**绝不写磁盘**，返回 `{ files }`。

---

## 7. 目录结构

```
jsonToCode/                      ← 项目根
├── cli.ts                       ← CLI 调试入口
├── package.json / tsconfig.json
├── lib/                         ← CLI 模式 tailwind 转换（与 Electron 共用）
│   └── convertTailwindToCSS.ts   ← tailwindcss v4 本地转换实现（含响应式 variant，config 内联）
├── api/                         ← 管线（可直接放入 Electron 项目）
│   ├── index.ts                 ← API 入口（downloadHuiCode）
│   ├── config/mappings/         ← 组件映射（按库名拆子目录：eview-react/、eview-ui/）
│   ├── src/                     ← core / pipeline / steps / codegen
│   └── templates/{lib}/         ← 输出项目模板（按库名拆子目录）
│       └── eview-ui/src/shared/  ← eview-ui 手动实现的公共组件（Badge/Divider/Chart，import @/shared/）
├── pages-source/                ← A2UI JSON 源（CLI 模式用）
├── output/                      ← 生成结果（CLI 模式用）
├── docs/
│   ├── ARCHITECTURE.md          ← 整体架构深参考
│   └── LLM-MAPPING-GUIDE.md     ← 映射文件编写指南
├── AGENTS.md                    ← Agent 指南
└── README.md                    ← 本文档
```

---

## 8. 集成方式

### Electron 集成

`api/` 文件夹可直接放入 Electron 项目（替换原 `packages/desktop/src/excode/`），调用链路：

```
Electron preload
  → ipc.ts
    → downloadHuiCode(input, { targetLib: 'eview-react' })
      → { files: [{ path, content }, ...] }
        → desktopApi.exportZip({ defaultName, files })
```

### 独立集成

```ts
const { files } = await import('./path/to/api/index').then(
  m => m.downloadHuiCode(input, options)
);
```

### Tailwind 转换模式切换

`api/src/codegen/tailwind-converter.ts` 是 CLI/Electron 双模式的唯一切换点，通过注释切换 import 块；`style-converter.ts` 及其它消费方都从该文件导入，不再各自切换：

```ts
// ─── Electron 模式（默认启用）────────────────────────────────
import {
  convertTailwindToLessRule,
  generateLessContent,
  convertTailwindToCSS,
  type LessRule,
} from '../../../main/tailwind-to-css'
// ─── CLI 模式（本仓库独立调试时手动切换：取消注释下方块、注释上方 Electron 块）──
// import {
//   convertTailwindToLessRule,
//   generateLessContent,
//   convertTailwindToCSS,
//   type LessRule,
// } from '../../../lib/convertTailwindToCSS'

export { convertTailwindToLessRule, generateLessContent, convertTailwindToCSS }
export type { LessRule }
```

- **Electron 模式**（默认）：本库主要嵌入 Electron 应用，`main/tailwind-to-css` 由 Electron 宿主提供
- **CLI 模式**：本仓库独立调试（`cli.ts` / `jsonTest/run-batch.ts`）时手动切到 CLI 块（取消注释 CLI、注释 Electron），使用 `lib/convertTailwindToCSS`，基于 tailwindcss v4 `__unstable__loadDesignSystem` API，`tailwindConfig` 内联于本文件（不再拆 `tailwind.config.ts`），含响应式 variant（伪类/@media/dark/rtl 由 `convertTailwindToLessRule` 统一产出）

> `main/tailwind-to-css` 在本仓库不存在（由 Electron 宿主提供），因此 Electron 默认下该 import 会报 TS2307「找不到模块」——属预期，切到 CLI 块后消失。

### 模板路径说明

API 模式下，`templateDir` 自动处理（[resolveTemplateDir](api/index.ts)，受保护集成契约，详见 [AGENTS §10](./AGENTS.md)）：
1. 先解析 `config.templateDir`（绝对路径直接用，相对路径相对于 `index.ts` 所在目录），未提供默认 `./templates`
2. 末尾拼接 `/{targetLib}` 子目录（templates 按库名拆分：`templates/eview-react/`、`templates/eview-ui/`）
3. 若不存在（electron-vite 构建后 `./templates` 未复制到 `out/main/`），回退到 `../../src/excode/templates/{targetLib}`
4. Electron 打包时 IPC 传 `process.resourcesPath/hui-templates`（绝对路径，其下需含各 lib 子目录），`{targetLib}` 在其下拼接

---

> 相关文档：
> - [AGENTS.md](./AGENTS.md) — Agent 指南
> - [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — 整体架构深参考
> - [docs/LLM-MAPPING-GUIDE.md](./docs/LLM-MAPPING-GUIDE.md) — 组件映射编写指南
