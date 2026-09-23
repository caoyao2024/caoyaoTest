// 离线图标组件 —— 基于内嵌 Lucide SVG 节点表渲染，无任何网络依赖。
// 背景：源项目 icon.jsx 走 icon-plus 在线（octo.hdesign.huawei.com），外网不可达；
// 本工程改为纯离线：把用到的 Lucide 图标节点内联进来，<Icon name="..." /> 契约不变。
import { createElement } from 'react';

// 仅收录本项目实际用到的图标节点（viewBox 0 0 24 24，stroke=currentColor）。
// 如需新增图标，从 lucide 取同形节点追加即可。
const LUCIDE = {
  bell: [['path', { d: 'M10.268 21a2 2 0 0 0 3.464 0' }], ['path', { d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326' }]],
  'chevron-down': [['path', { d: 'm6 9 6 6 6-6' }]],
  'chevron-up': [['path', { d: 'm18 15-6-6-6 6' }]],
  'circle-check': [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'm9 12 2 2 4-4' }]],
  'circle-slash': [['circle', { cx: '12', cy: '12', r: '10' }], ['line', { x1: '9', x2: '15', y1: '15', y2: '9' }]],
  clock: [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'M12 6v6l4 2' }]],
  copy: [['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }], ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }]],
  download: [['path', { d: 'M12 15V3' }], ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }], ['path', { d: 'm7 10 5 5 5-5' }]],
  ellipsis: [['circle', { cx: '12', cy: '12', r: '1' }], ['circle', { cx: '19', cy: '12', r: '1' }], ['circle', { cx: '5', cy: '12', r: '1' }]],
  'file-spreadsheet': [['path', { d: 'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z' }], ['path', { d: 'M14 2v5a1 1 0 0 0 1 1h5' }], ['path', { d: 'M8 13h2' }], ['path', { d: 'M14 13h2' }], ['path', { d: 'M8 17h2' }], ['path', { d: 'M14 17h2' }]],
  gauge: [['path', { d: 'm12 14 4-4' }], ['path', { d: 'M3.34 19a10 10 0 1 1 17.32 0' }]],
  minus: [['path', { d: 'M5 12h14' }]],
  plus: [['path', { d: 'M5 12h14' }], ['path', { d: 'M12 5v14' }]],
  'refresh-cw': [['path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }], ['path', { d: 'M21 3v5h-5' }], ['path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }], ['path', { d: 'M8 16H3v5' }]],
  search: [['path', { d: 'm21 21-4.34-4.34' }], ['circle', { cx: '11', cy: '11', r: '8' }]],
  'square-pen': [['path', { d: 'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }], ['path', { d: 'M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z' }]],
  'trash-2': [['path', { d: 'M10 11v6' }], ['path', { d: 'M14 11v6' }], ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }], ['path', { d: 'M3 6h18' }], ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }]],
  'trending-down': [['path', { d: 'M16 17h6v-6' }], ['path', { d: 'm22 17-8.5-8.5-5 5L2 7' }]],
  'trending-up': [['path', { d: 'M16 7h6v6' }], ['path', { d: 'm22 7-8.5 8.5-5-5L2 17' }]],
  upload: [['path', { d: 'M12 3v12' }], ['path', { d: 'm17 8-5-5-5 5' }], ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }]],
};

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function lookupIcon(name) {
  if (!name) return null;
  return (
    LUCIDE[name] ||
    LUCIDE[camelToKebab(name)] ||
    LUCIDE[name.replace(/-([a-z])/g, (_m, c) => c.toUpperCase())] ||
    null
  );
}

// <Icon name="search" size={16} color="#0067D1" className="..." />
// name 命中 Lucide 表即渲染 SVG；未命中渲染 null（与源项目离线分支一致）。
export default function Icon({ name, src, size = 16, color, className = '', style, strokeWidth = 2 }) {
  // 用户自有图片资源（相对路径）—— 优先于 name
  if (src) {
    return createElement('img', {
      src,
      width: size,
      height: size,
      className,
      alt: '',
      'aria-hidden': true,
      style: { ...style, display: 'inline-block', verticalAlign: 'middle' },
    });
  }

  const nodes = lookupIcon(name);
  if (!nodes) return null;

  return createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className,
      'aria-hidden': true,
      style: { ...style, stroke: color || 'currentColor' },
    },
    nodes.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))
  );
}
