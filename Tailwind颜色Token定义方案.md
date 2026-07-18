# Tailwind CSS 颜色 Token 定义方案

> 时间：2026-07-18
> 项目：UXAI-dev_pattern / previewpc

---

## 背景

`tailwind.config.ts` 中定义了 `theme.extend.colors`，用于给 AI 理解可用的颜色 Tokens。目前已有一层「设计 Token」（primary、surface、error 等），但 `base.css` 中的基础色阶和 `hui-base.css` 中的 HUI 语义色尚未暴露给 Tailwind，导致：

1. AI 无法生成引用了这些颜色的 Tailwind class
2. 用户选色面板不认识它们
3. 代码层只能用内联 style，无法统一走 Tailwind

---

## 颜色体系三层架构

| 层级 | CSS 来源 | 示例变量 | Tailwind 命名空间 |
|---|---|---|---|
| **① 基础色阶** | `base.css` | `--neutral-50`、`--primary-500` | `base-*`（16 个色系） |
| **② 设计 Token** | `hui-base.css` 尾部 | `--primary`、`--on-surface` | 扁平 key（已有） |
| **③ HUI 语义色** | `hui-base.css` 头部 ~line 180 | `--color-text-primary`、`--color-bg-1` | `hui-*` |

---

## 命名冲突分析

Tailwind 已内置 `neutral-50`、`red-500`、`green-100` 等色阶名称，直接使用会冲突。解决方案：**命名空间隔离**。

| 命名空间 | 冲突风险 | 示例 class |
|---|---|---|
| `base-neutral-50` | ✅ 无冲突 | `text-base-neutral-900` |
| `base-primary-500` | ✅ 无冲突 | `bg-base-primary-500` |
| `hui-text-primary` | ✅ 无冲突 | `text-hui-text-primary` |
| `hui-bg-1` | ✅ 无冲突 | `bg-hui-bg-1` |

---

## 方案：分层命名空间

### 定义方式（tailwind.config.ts）

```ts
"colors": {
  // === 第②层：设计 Token（已有） ===
  "primary": "var(--primary, #0067D1)",
  "surface": "var(--surface, #F3F3F3)",
  // ...

  // === 第①层：基础色阶（新增） ===
  "base": {
    "neutral": {
      "0": "var(--neutral-0, #FFFFFF)",
      "50": "var(--neutral-50, #F3F3F3)",
      "100": "var(--neutral-100, #DFDFDF)",
      // ... 900, 950
    },
    "primary": {
      "0": "var(--primary-0, #FFFFFF)",
      "50": "var(--primary-50, #E6F2FD)",
      // ... 950
    },
    "success": { /* ... */ },
    "warning": { /* ... */ },
    "alert": { /* ... */ },
    "error": { /* ... */ },
    "brand": { "5": "var(--brand-5, #E6F2FD)", /* ... 10~90 */ },
    "gray": { "0": "var(--gray-0, #FFFFFF)", /* ... 5~100 */ },
    "red": { "5": "var(--red-5, #FEE7E8)", /* ... 10~90 */ },
    "rose": { "5": "var(--rose-5, #FEE5F2)", /* ... */ },
    "orange": { "5": "var(--orange-5, #FEF5E8)", /* ... */ },
    "yellow": { "5": "var(--yellow-5, #FEFCE0)", /* ... */ },
    "green": { "5": "var(--green-5, #F2FBE9)", /* ... */ },
    "mint": { "5": "var(--mint-5, #E7FBF2)", /* ... */ },
    "cyan": { "5": "var(--cyan-5, #E8FCFD)", /* ... */ },
    "blue": { "5": "var(--blue-5, #EEF3FE)", /* ... */ },
    "indigo": { "5": "var(--indigo-5, #EEEEFE)", /* ... */ },
    "purple": { "5": "var(--purple-5, #F7EDFE)", /* ... */ },
    "pink": { "5": "var(--pink-5, #FDE6FC)", /* ... */ }
  },

  // === 第③层：HUI 语义色（新增） ===
  "hui": {
    "brand": "var(--color-brand)",
    "brand-hover": "var(--color-brand-hover)",
    "brand-focus": "var(--color-brand-focus)",
    "brand-active": "var(--color-brand-active)",
    "brand-disabled": "var(--color-brand-disabled)",

    "text-primary": "var(--color-text-primary)",
    "text-secondary": "var(--color-text-secondary)",
    "text-placeholder": "var(--color-text-placeholder)",
    "text-disabled": "var(--color-text-disabled)",
    "text-inverse": "var(--color-text-inverse)",
    "text-inverse-disabled": "var(--color-text-inverse-disabled)",
    "text-on": "var(--color-text-on)",
    "link": "var(--color-link)",
    "link-hover": "var(--color-link-hover)",
    "link-active": "var(--color-link-active)",
    "link-visited": "var(--color-link-visited)",
    "link-disabled": "var(--color-link-disabled)",

    "bg-1": "var(--color-bg-1)",
    "bg-2": "var(--color-bg-2)",
    "bg-3": "var(--color-bg-3)",
    "bg-4": "var(--color-bg-4)",
    "bg-5": "var(--color-bg-5)",
    "bg-6": "var(--color-bg-6)",
    "bg-mask": "var(--color-bg-mask)",

    "fill-disabled": "var(--color-fill-disabled)",
    "hover": "var(--color-hover)",
    "fill-disabled-subtle": "var(--color-fill-disabled-subtle)",
    "fill": "var(--color-fill)",
    "select": "var(--color-select)",
    "fill-subtle": "var(--color-fill-subtle)",

    "icon-primary": "var(--color-icon-primary)",
    "icon-secondary": "var(--color-icon-secondary)",
    "icon-tertiary": "var(--color-icon-tertiary)",
    "icon-placeholder": "var(--color-icon-placeholder)",
    "icon-disabled": "var(--color-icon-disabled)",
    "icon-inverse": "var(--color-icon-inverse)",
    "icon-hover": "var(--color-icon-hover)",
    "icon-focus": "var(--color-icon-focus)",
    "icon-active": "var(--color-icon-active)",

    "border": "var(--color-border)",
    "border-hover": "var(--color-border-hover)",
    "border-focus": "var(--color-border-focus)",
    "border-active": "var(--color-border-active)",
    "border-disabled": "var(--color-border-disabled)",
    "border-separator": "var(--color-border-separator)",
    "border-separator-subtle": "var(--color-border-separator-sbutle)",

    "error": "var(--color-error)",
    "error-hover": "var(--color-error-hover)",
    "error-active": "var(--color-error-active)",
    "error-disabled": "var(--color-error-disabled)",
    "error-subtle": "var(--color-error-subtle)",
    "error-subtler": "var(--color-error-subtler)",

    "alert": "var(--color-alert)",
    "alert-hover": "var(--color-alert-hover)",
    "alert-active": "var(--color-alert-active)",
    "alert-disabled": "var(--color-alert-disabled)",
    "alert-subtle": "var(--color-alert-subtle)",
    "alert-subtler": "var(--color-alert-subtler)",

    "warning": "var(--color-warning)",
    "warning-hover": "var(--color-warning-hover)",
    "warning-active": "var(--color-warning-active)",
    "warning-disabled": "var(--color-warning-disabled)",
    "warning-bold": "var(--color-warning-bold)",
    "warning-subtle": "var(--color-warning-subtle)",
    "warning-subtler": "var(--color-warning-subtler)",

    "success": "var(--color-success)",
    "success-hover": "var(--color-success-hover)",
    "success-active": "var(--color-success-active)",
    "success-disabled": "var(--color-success-disabled)",
    "success-subtle": "var(--color-success-subtle)",
    "success-subtler": "var(--color-success-subtler)",

    "info-primary": "var(--color-info-primary)",
    "info-primary-subtle": "var(--color-info-primary-subtle)",
    "info-primary-subtler": "var(--color-info-primary-subtler)",
    "info-secondary": "var(--color-info-secondary)",
    "info-secondary-hover": "var(--color-info-secondary-hover)",
    "info-secondary-active": "var(--color-info-secondary-active)",
    "info-secondary-disabled": "var(--color-info-secondary-disabled)",
    "info-secondary-subtle": "var(--color-info-secondary-subtle)",

    "none": "var(--color-none)",
    "none-hover": "var(--color-none-hover)",
    "none-active": "var(--color-none-active)",
    "none-disabled": "var(--color-none-disabled)",
    "none-subtle": "var(--color-none-subtle)",

    "chart-1": "var(--color-chart-1)",
    "chart-2": "var(--color-chart-2)",
    "chart-3": "var(--color-chart-3)",
    "chart-4": "var(--color-chart-4)",
    "chart-6": "var(--color-chart-6)",
    // ... chart-7 ~ chart-25

    "scrollbar": "var(--color-scrollbar)",
    "scrollbar-hover": "var(--color-scrollbar-hover)",
    "card-gray-disabled": "var(--color-card-gray-disabled)",
    "card-white-disabled": "var(--color-card-white-disabled)",
    "sidenav-bg": "var(--color-sidenav-bg)",
    "table-header": "var(--color-table-header)",
    "table-zebra": "var(--color-table-zebra)",
    "radiogp-bg": "var(--color-radiogp-bg)",
    "radiogp-text": "var(--color-radiogp-text)",
    "message-bg-info": "var(--color-message-bg-info)",
    "message-bg-success": "var(--color-message-bg-success)",
    "message-bg-warning": "var(--color-message-bg-warning)",
    "message-bg-alert": "var(--color-message-bg-alert)",
    "message-bg-error": "var(--color-message-bg-error)",

    "tag-text-purple": "var(--color-tag-text-purple)",
    "tag-bg-purple": "var(--color-tag-bg-purple)",
    "tag-text-cyan": "var(--color-tag-text-cyan)",
    "tag-bg-cyan": "var(--color-tag-bg-cyan)",
    "tag-text-rose": "var(--color-tag-text-rose)",
    "tag-bg-rose": "var(--color-tag-bg-rose)",
    "tag-text-green": "var(--color-tag-text-green)",
    "tag-bg-green": "var(--color-tag-bg-green)",
    "tag-text-pink": "var(--color-tag-text-pink)",
    "tag-bg-pink": "var(--color-tag-bg-pink)",
    "tag-text-indigo": "var(--color-tag-text-indigo)",
    "tag-bg-indigo": "var(--color-tag-bg-indigo)",
    "tag-text-none": "var(--color-tag-text-none)",
    "tag-bg-none": "var(--color-tag-bg-none)",
    "tag-text-error": "var(--color-tag-text-error)",
    "tag-bg-error": "var(--color-tag-bg-error)",
    "tag-text-alert": "var(--color-tag-text-alert)",
    "tag-bg-alert": "var(--color-tag-bg-alert)",
    "tag-text-warning": "var(--color-tag-text-warning)",
    "tag-bg-warning": "var(--color-tag-bg-warning)",
    "tag-text-success": "var(--color-tag-text-success)",
    "tag-bg-success": "var(--color-tag-bg-success)",
    "tag-text-info": "var(--color-tag-text-info)",
    "tag-bg-info": "var(--color-tag-bg-info)"
  }
}
```

Tailwind 会将嵌套的 `colors` 对象递归拍平，自动生成 class name：
- `base.neutral.900` → `text-base-neutral-900`、`bg-base-neutral-900`
- `hui.text-primary` → `text-hui-text-primary`、`bg-hui-text-primary`
- `hui.chart-1` → `text-hui-chart-1`、`bg-hui-chart-1`

**关键规律**：`text-` / `bg-` / `border-` 等 Tailwind 前缀后面直接跟 `colors` 对象里的 key 路径，用 `-` 连接。嵌套多少层就加多少段段，没有例外。

---

## 使用示例

```html
<!-- 语义 Token（已有） -->
<span class="text-primary">主色文字</span>
<div class="bg-surface-container">容器背景</div>

<!-- 基础色阶（新增） -->
<span class="text-base-neutral-900">深灰文字</span>
<div class="bg-base-primary-500">主色背景</div>
<div class="bg-base-neutral-50">浅灰背景</div>
<span class="text-base-error-500">红色文字</span>
<el-tag class="bg-base-rose-5 text-base-rose-60">玫瑰标签</el-tag>

<!-- HUI 语义色（新增） -->
<span class="text-hui-text-primary">主要文本色</span>
<span class="text-hui-text-secondary">次要文本色</span>
<div class="bg-hui-bg-1">基础背景区</div>
<div class="bg-hui-bg-2">白色背景区</div>
<span class="text-hui-chart-1">图例色</span>
<div class="bg-hui-tag-bg-success text-hui-tag-text-success">成功标签</div>
<div class="border-hui-border">边框</div>
```

### 完整字段对照

| 你想用的颜色 | CSS 变量 | Tailwind class |
|---|---|---|
| 设计 Token - 主色 | `--primary` | `text-primary` / `bg-primary` |
| 基础色 - 中性 900 | `--neutral-900` | `text-base-neutral-900` / `bg-base-neutral-900` |
| 基础色 - 主色 500 | `--primary-500` | `text-base-primary-500` / `bg-base-primary-500` |
| HUI - 主要文本 | `--color-text-primary` | `text-hui-text-primary` / `bg-hui-text-primary` |
| HUI - 次要文本 | `--color-text-secondary` | `text-hui-text-secondary` / `bg-hui-text-secondary` |
| HUI - 背景 1 | `--color-bg-1` | `bg-hui-bg-1` |
| HUI - 边框 | `--color-border` | `border-hui-border` |
| HUI - 图标主色 | `--color-icon-primary` | `text-hui-icon-primary` |
| HUI - 图表色 1 | `--color-chart-1` | `text-hui-chart-1` / `bg-hui-chart-1` |
| HUI - Tag 成功背景 | `--color-tag-bg-success` | `bg-hui-tag-bg-success` |

---

## 设计考虑

### 为什么 `base` 和 `hui` 直接写在 `colors` 里？

这是 Tailwind 的标准用法。`colors` 对象支持任意深度的嵌套，每一级自动变成 class 名中的 `-` 分隔段：

```ts
colors: {
  "base": { "neutral": { "50": "..." } }  // → text-base-neutral-50
}
```

### 关于 hui 命名设计

由于 CSS 变量名为 `--color-text-primary`，而 Tailwind 的 class 前缀已经是 `text-`，所以 class 名会变成 `text-hui-text-primary`（有冗余）。但这是 Tailwind 语法的自然结果——`text-` + 颜色名称，颜色名称就是 `hui-text-primary`（正好对应 CSS 变量名 `--color-text-primary` 去掉 `--color-` 前缀）。

如果觉得冗余，可以把 hui 层级的变量名再缩短，例如 `--ct-primary`、`--cbg-1`，但这会破坏 CSS 可读性且需要修改组件库引用，不建议。

### chart-5 缺失

`hui-base.css` 中 `--color-chart-5` 不存在（chart-4 直接跳到 chart-6），已在 tailwind.config.ts 中移除对应映射。

---

## 依赖说明

- Tailwind CSS v4（通过 `@tailwindcss/vite` 引入）
- 配置通过 `style.css` 中的 `@config "../tailwind.config.ts"` 加载
- 原有的 `theme.extend.colors` 模式在 v4 中通过 `@config` 兼容支持

---

## 对话记录

### 问题提出

**用户**：tailwind.config.ts 中定义了很多 extend，这个是给 ai 去理解的，现在用的很好。但是 hui-base.css 和 base.css 中其他的颜色也可以让用户在面板上选择使用，但代码层面要转换成 tailwind 名称，我要如何将它们定义出来。

**分析**：tailwind.config.ts 目前只有「设计 Token」层（primary、surface、error 等），缺少：
1. base.css 的「基础色阶」（--neutral-50、--primary-500 等）
2. hui-base.css 的「HUI 语义色」（--color-text-primary、--color-bg-1 等）

---

### 方案讨论

**方案一：平铺式扩展**

```ts
"color-text-primary": "var(--color-text-primary)",
"color-bg-1": "var(--color-bg-1)",
```

❌ 平铺过多条目会变得混乱，且语义分组不明显。

**方案二：命名空间嵌套（选定方案）**

```ts
"base": { "neutral": { "50": "..." } }   // → text-base-neutral-50
"hui": { "text-primary": "..." }          // → text-hui-text-primary
```

✅ Tailwind 原生支持 colors 嵌套，多级自动拍平
✅ 避免与 Tailwind 内置色系（neutral、red 等）冲突
✅ 分组清晰，AI 易于理解

---

### 关键答疑

**Q：base 和 hui 写在 colors 属性里对吗？**

A：对的。Tailwind 的 `colors` 对象支持任意深度的嵌套，每一级自动变成 class 名中的 `-` 分段。这是标准用法，不需要改动结构。

**Q：文字色和背景色的 Tailwind 字段是什么样？**

A：统一用 `text-{color-name}` 和 `bg-{color-name}`。例如：

| 用途 | Tailwind class |
|---|---|
| 基础色中性 900 文字 | `text-base-neutral-900` |
| 基础色主色 500 背景 | `bg-base-primary-500` |
| HUI 主要文本色 | `text-hui-text-primary` |
| HUI 背景 1 | `bg-hui-bg-1` |

---

### 实施修正

在编辑 tailwind.config.ts 过程中发现一个注意点：

**hui-base.css 只应取第 1~180 行的 `--color-*` 变量**（用户纠正），第 180 行以后是另外的语义化 Token（--text-default、--surface-background 等），不属于 HUI 组件语义色范畴。

另外 `--color-chart-5` 在 CSS 中不存在（chart-4 直接跳到 chart-6），已在配置中移除。

---

### 最终产出

- [x] `tailwind.config.ts` 中补全了 `base-*`（16 个色系，~170 个色阶值）
- [x] `tailwind.config.ts` 中补全了 `hui-*`（~110 个 HUI 语义色 Token）
- [x] 以上变更已写入此文档
