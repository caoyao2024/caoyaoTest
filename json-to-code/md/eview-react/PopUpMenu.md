# PopUpMenu

**Import:** `import PopUpMenu from '@nce/eview-react/PopUpMenu'`

## 基本用法

### 子元素触发模式

传入 `children` 作为触发元素，点击触发元素自动切换菜单显示/隐藏，菜单定位基于触发元素 DOM 位置自动计算。

```tsx
import PopUpMenu from '@nce/eview-react/PopUpMenu';

function Example() {
  const options = [
    { text: '新建', value: 'new', iconUrl: '<Icon组件或URL>' },
    { text: '编辑', value: 'edit' },
    { text: '删除', value: 'delete', disable: true },
    { isDivider: true },
    {
      text: '更多',
      value: 'more',
      submenus: [
        { text: '导出', value: 'export' },
        { text: '导入', value: 'import' },
      ],
    },
  ];

  return (
    <PopUpMenu
      options={options}
      direction="auto"
      hDirection="auto"
      width="160px"
      onClick={e => console.log(e.text, e.value)}
      onBlur={() => console.log('blur')}
    >
      <button>打开菜单</button>
    </PopUpMenu>
  );
}
```

## Props

| 属性名         | 类型                                                                      | 默认值    | 说明                                                             |
| -------------- | ------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------- |
| children       | `React.ReactNode`                                                         | -         | **必填**，触发元素，点击切换菜单；若带 `disabled` 属性则点击无效 |
| options        | `OptionType[]`                                                            | -         | 菜单数据项                                                       |
| direction      | `'up' \| 'down' \| 'auto'`                                                | `'auto'`  | 菜单垂直弹出方向                                                 |
| hDirection     | `'left' \| 'right' \| 'auto'`                                             | `'auto'`  | 菜单水平对齐方向（相对触发元素）                                 |
| width          | `number \| string`                                                        | `'120px'` | 菜单宽度                                                         |
| className      | `string`                                                                  | -         | 作用于菜单内容项的类名                                           |
| style          | `React.CSSProperties`                                                     | -         | 作用于菜单的样式                                                 |
| onClick        | `(event: { text?: string; value?: any; clickItem?: OptionType }) => void` | -         | 菜单项点击回调                                                   |
| onBlur         | `(value?: any, event?: React.ReactElement) => void`                       | -         | 失焦/点击菜单外部回调                                            |
| onKeyDown      | `(event) => void`                                                         | -         | 菜单打开时的键盘事件回调                                         |

## OptionType

| 属性名    | 类型                           | 默认值  | 说明                                                       |
| --------- | ------------------------------ | ------- | ---------------------------------------------------------- |
| id        | `string`                       | -       | 选项唯一 id                                                |
| text      | `string`                       | -       | 选项显示文字                                               |
| value     | `string`                       | -       | 选项值（作为 onClick 回调中 value 返回，优先于从 id 解析） |
| cls       | `string`                       | -       | 选项自定义类名                                             |
| iconUrl   | `string \| React.ReactElement` | -       | 图标 URL 或 React 图标组件                                 |
| submenus  | `OptionType[]`                 | -       | 子菜单（支持多级嵌套）                                     |
| disable   | `boolean`                      | `false` | 是否禁用                                                   |
| isDivider | `boolean`                      | -       | 是否为分割线                                               |
| title     | `string`                       | -       | 鼠标悬停提示文字                                           |

## Events

| 事件名         | 参数                                                              | 说明                     |
| -------------- | ----------------------------------------------------------------- | ------------------------ |
| onClick        | `(event: { text?: string; value?: any; clickItem?: OptionType })` | 菜单项点击回调           |
| onBlur         | `(value?: any, event?: React.ReactElement)`                       | 失焦/点击菜单外部回调    |
| onClickOutside | -                                                                 | 点击菜单外部回调         |
| onKeyDown      | `(event)`                                                         | 菜单打开时的键盘事件回调 |

## Slots

| slot 名  | 说明                            |
| -------- | ------------------------------- |
| children | 触发元素，点击切换菜单显示/隐藏 |

## 注意事项
- 触发方式固定为 `click`，暂不支持配置为 hover 等其他触发方式
- 点击触发元素切换菜单，内置 1 秒防抖防止重复触发
- 若 `children` 元素带有 `disabled` 属性，点击将被阻止，菜单不会打开
- 点击菜单外部（mousedown / mousewheel）自动关闭菜单
- 菜单通过 `RenderOutside` 渲染到 body 外层，通过 `ClickAwayListener` 监听外部点击
- `direction` 为 `auto` 时，组件根据可用空间自动判断向上或向下弹出
- `hDirection` 为 `auto` 时，组件根据可用空间自动判断向左或向右对齐
- 支持键盘交互：`↑/↓` 移动焦点，`→/←` 展开/收起子菜单，`Enter` 选中，`Esc` 关闭，`Tab` 阻止默认跳转