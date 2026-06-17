const fs = require('fs');

const componentIndex = JSON.parse(fs.readFileSync('component_index.json', 'utf-8'));
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

const componentSets = componentIndex.componentSets;

// Build lookup maps by name
const nameMap = new Map();
componentSets.forEach(set => {
  nameMap.set(set.name, set);
  // Also index by simplified name (remove prefix like "1.", "2." etc)
  const simplified = set.name.replace(/^\d+\./, '').replace(/^\s+/, '');
  if (!nameMap.has(simplified)) {
    nameMap.set(simplified, set);
  }
});

// ============================================================
// Complete component mapping: API component name → design component set name(s)
// Based on catalog.py + component_index.json structure
// ============================================================
const componentMapping = {
  // === General ===
  'Button': {
    // types=link → 文字链接/文本按钮; shape=circle → 图标按钮; else → 1.按钮
    conditional: (element) => {
      const p = element.props || {};
      if (p.types === 'link' && !p.value) return '文字链接';       // icon-only link
      if (p.types === 'link' && p.value) return '5.文本按钮';       // text link button
      if (p.shape === 'circle' && !p.value) return '7.图标按钮';   // icon circle button
      if (p.shape === 'round') return '4.富按钮';                  // rich button
      if (p.icon && !p.value) return '7.图标按钮';                 // icon-only button
      return '1.按钮';                                             // default button
    }
  },
  'Icon': '7.图标按钮',

  // === Navigation ===
  'Tabs': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.type === 'card') return '3.选项卡式页签组';
      if (p.type === 'line' || p.type === 'divider') return '2.分割线式页签组';
      return '1.基础页签组';
    }
  },
  'TabItem': '.基础页签单项',
  'Steps': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.direction === 'vertical') return '4.纵向单链型';
      if (p.type === 'arrow') return '1.箭头型步骤条';
      return '3.横向单链型-水平节点';
    }
  },
  'StepItem': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.direction === 'vertical') return '.纵向单链单项';
      if (p.type === 'arrow') return '.箭头型步骤单项';
      return '.水平节点单项';
    }
  },
  'Breadcrumb': '1.面包屑组',
  'Dropdown': '1.下拉菜单',
  'Menu': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.mode === 'vertical') return '1.侧边导航';
      return '1.顶部导航';
    }
  },

  // === DataEntry ===
  'Checkbox': '1.复选项',
  'CheckboxGroup': '2.复选组',
  'RadioGroup': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.type === 'button') return '3.单选按钮组';
      return '2.单选组';
    }
  },
  'Select': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.multiple) return '2.选择器';
      return '1.选择框';
    }
  },
  'Slider': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.showInput) return '2.完整滑动条';
      return '1.滑动条';
    }
  },
  'Switch': '1.开关-基础样式',
  'Input': '1.单行文本输入框',
  'InputNumber': '1.计数器',
  'TextArea': '3.多行文本输入框',
  'TimePicker': '1.时间选择',
  'DatePicker': '1.日期选择',
  'Rate': '1.评分',

  // === DataDisplay ===
  'Tag': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.variant === 'outlined') return ' 2.基础标签';
      if (p.color) {
        if (typeof p.color === 'string' && p.color.startsWith('#')) return ' 3.彩色标签-浅色背景';
      }
      return ' 2.基础标签';
    }
  },
  'Table': '表格',
  'TableRow': '.表格子元素',
  'Collapse': '折叠面板',
  'CollapseItem': '.子组件-折叠面板单项',
  'Timeline': '时间轴',
  'TimelineItem': '.一项',
  'Divider': '分割线',
  'Badge': '1.徽标',
  'Carousel': '1.走马灯',
  'Segmented': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.type === 'button') return '4.单选按钮-视图切换';
      return '.视图切换元素';
    }
  },
  'Tree': '结构树',

  // === Response ===
  'Progress': {
    conditional: (element) => {
      const p = element.props || {};
      if (p.type === 'circle' || p.type === 'ring') return '3.环形进度条';
      if (p.type === 'step') return '2.步骤进度条';
      return '1.线性进度条';
    }
  },

  // === Chart (charts don't have direct design component counterparts in component_index.json) ===
  // Charts are API-level components; skip matching
  'LineChart': null,
  'BarChart': null,
  'PieChart': null,
  'RadarChart': null,
  'GaugeChart': null,
  'ProcessChart': null,
  'BubbleChart': null,
  'AssembleBubbleChart': null,
  'BulletChart': null,
  'FunnelChart': null,
  'HillChart': null,
  'ScatterChart': null,
  'JadeJueChart': null,
  'CircleProcessChart': null,

  // === Custom ===
  'PatGauge': null,
  'PatStackedBar': null,
};

// ============================================================
// Variant matching logic
// ============================================================
function parseVariantName(variantName) {
  const result = {};
  const parts = variantName.split(/,\s*/);
  for (const part of parts) {
    const trimmed = part.trim();
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      result[key] = value;
    }
  }
  return result;
}

function matchVariant(element, componentSet) {
  if (!componentSet || !componentSet.variants || componentSet.variants.length === 0) return null;

  const props = element.props || {};
  const variants = componentSet.variants;
  const componentName = element.component;

  // For single variant components, return the only one
  if (variants.length === 1) return variants[0];

  let bestVariant = null;
  let bestScore = -Infinity;

  for (const variant of variants) {
    const vp = parseVariantName(variant.name);
    let score = 0;

    // === Button matching ===
    if (componentName === 'Button') {
      // Color/status mapping
      if (props.color === 'primary' && vp.status === 'primary') score += 10;
      if (props.color === 'default' && vp.status === 'default') score += 10;
      if (props.color === 'danger' && vp.status === 'risk-filled') score += 10;
      if (!props.color && vp.status === 'primary') score += 5; // default to primary

      // Size mapping (API uses medium, design uses normal)
      if (props.size === 'large' && vp.size === 'large') score += 5;
      if (props.size === 'small' && vp.size === 'small') score += 5;
      if (props.size === 'medium' && vp.size === 'normal') score += 5;
      if (!props.size && vp.size === 'normal') score += 3;
      if (!props.size && vp.size === 'large') score += 1;

      // Interaction
      if (vp.Interaction === 'default') score += 2;
      if (vp.disabled === 'false') score += 1;
    }

    // === Icon matching ===
    else if (componentName === 'Icon') {
      // Shape → size mapping
      if (props.shape === 'outline' && vp.size === 'small') score += 5;
      if (props.shape === 'fill' && vp.size === 'small') score += 5;
      if (props.shape === 'circle' && vp.size === 'normal') score += 5;
      if (props.shape === 'square' && vp.size === 'normal') score += 5;
      if (!props.shape && vp.size === 'small') score += 3;

      // Interaction
      if (vp.Interaction === 'default') score += 2;
      if (vp.disabled === 'false') score += 1;
    }

    // === Input matching ===
    else if (componentName === 'Input') {
      if (vp.type === 'text') score += 8;
      if (vp.Interaction === 'default') score += 3;
      if (props.className && props.className.includes('w-') && vp.size === 'normal') score += 2;
      if (vp.size === 'normal') score += 2;
      if (vp.disabled === 'false') score += 1;
    }

    // === Menu matching ===
    else if (componentName === 'Menu') {
      // Side navigation vs top navigation
      if (props.mode === 'vertical' && vp.expanded !== undefined) score += 10;
      if (props.mode !== 'vertical' && vp.accordin !== undefined) score += 10;
      if (vp.expanded === 'false' || vp.accordin === 'false') score += 3;
      if (vp.number && vp.number >= 2 && vp.number <= 15) score += 2;
    }

    // === Dropdown matching ===
    else if (componentName === 'Dropdown') {
      if (vp.buttonType === 'button') score += 5;
      if (vp.size === 'normal') score += 3;
      if (vp.Interaction === 'default') score += 3;
      if (vp.popupDirection === 'bottom') score += 2;
      if (vp.disabled === 'false') score += 1;
    }

    // === Tag matching ===
    else if (componentName === 'Tag') {
      if (props.variant === 'outlined' && vp.Interaction === 'default') score += 5;
      if (!props.variant && vp.Interaction === 'default') score += 5;
      if (props.color && typeof props.color === 'string') {
        // Colored tag
        if (vp.Interaction === 'default') score += 3;
      }
    }

    // === Table matching ===
    else if (componentName === 'Table') {
      if (vp.type === 'normal' && vp.interaction === 'normal') score += 5;
      if (vp.type === 'normal') score += 3;
      if (vp.isGray === 'off') score += 2;
    }

    // === TableRow matching ===
    else if (componentName === 'TableRow') {
      if (vp.type === 'normal' && vp.interaction === 'normal') score += 5;
      if (vp.type === 'normal') score += 3;
    }

    // === Badge matching ===
    else if (componentName === 'Badge') {
      if (vp.Interaction === 'default' || vp.interaction === 'default') score += 3;
    }

    // === Collapse matching ===
    else if (componentName === 'Collapse') {
      if (vp.type === 'default') score += 3;
      if (vp.number && vp.number >= 2) score += 2;
    }

    // === Carousel matching ===
    else if (componentName === 'Carousel') {
      if (vp.activeKey === '1') score += 3;
      if (vp._type === 'gray') score += 2;
    }

    // === Progress matching ===
    else if (componentName === 'Progress') {
      if (vp.Interaction === 'default' || vp.interaction === 'default') score += 3;
    }

    // === Tabs matching ===
    else if (componentName === 'Tabs') {
      if (vp.number && props.items && vp.number === String(props.items.length)) score += 10;
      if (vp.size === 'normal') score += 3;
      if (vp.addable === 'false') score += 2;
    }

    // === Steps matching ===
    else if (componentName === 'Steps') {
      if (vp.number && props.items && vp.number === String(props.items.length)) score += 10;
      if (vp.size === 'normal') score += 3;
    }

    // === Breadcrumb matching ===
    else if (componentName === 'Breadcrumb') {
      if (vp.number && props.items && vp.number === String(props.items.length)) score += 10;
      if (vp.number === '3') score += 3;
    }

    // === Select matching ===
    else if (componentName === 'Select') {
      if (vp.Interaction === 'default') score += 3;
      if (vp.size === 'normal') score += 3;
      if (vp.disabled === 'false') score += 1;
    }

    // === Checkbox/CheckboxGroup matching ===
    else if (componentName === 'Checkbox' || componentName === 'CheckboxGroup') {
      if (vp.Interaction === 'default' || vp.interaction === 'default') score += 3;
      if (vp.size === 'normal') score += 2;
    }

    // === RadioGroup matching ===
    else if (componentName === 'RadioGroup') {
      if (vp.Interaction === 'default' || vp.interaction === 'default') score += 3;
      if (vp.size === 'normal') score += 2;
    }

    // === Switch matching ===
    else if (componentName === 'Switch') {
      if (vp.Interaction === 'default') score += 3;
    }

    // === Slider matching ===
    else if (componentName === 'Slider') {
      if (vp.Interaction === 'default') score += 3;
    }

    // === InputNumber matching ===
    else if (componentName === 'InputNumber') {
      if (vp.Interaction === 'default') score += 3;
      if (vp.size === 'normal') score += 2;
    }

    // === TextArea matching ===
    else if (componentName === 'TextArea') {
      if (vp.Interaction === 'default' && vp.disabled === 'false') score += 5;
    }

    // === DatePicker matching ===
    else if (componentName === 'DatePicker') {
      if (vp.Interaction === 'default') score += 3;
    }

    // === TimePicker matching ===
    else if (componentName === 'TimePicker') {
      if (vp.Interaction === 'default') score += 3;
    }

    // === Rate matching ===
    else if (componentName === 'Rate') {
      if (vp.Interaction === 'default') score += 3;
    }

    // === Segmented matching ===
    else if (componentName === 'Segmented') {
      if (vp.Interaction === 'default' || vp.interaction === 'default') score += 3;
    }

    // === Tree matching ===
    else if (componentName === 'Tree') {
      if (vp.Interaction === 'default') score += 3;
    }

    // === Timeline/TimelineItem matching ===
    else if (componentName === 'Timeline' || componentName === 'TimelineItem') {
      if (vp.Interaction === 'default' || vp.interaction === 'default') score += 3;
    }

    // === CollapseItem matching ===
    else if (componentName === 'CollapseItem') {
      if (vp.Expand === 'false') score += 3;
    }

    // === TabItem matching ===
    else if (componentName === 'TabItem') {
      if (vp.Interaction === 'active') score += 5;
      if (vp.Interaction === 'default') score += 3;
      if (vp.size === 'normal') score += 2;
    }

    // === StepItem matching ===
    else if (componentName === 'StepItem') {
      if (vp._process === 'going' && vp.select === 'true') score += 5;
      if (vp._process === 'complete') score += 3;
      if (vp._process === 'going') score += 2;
      if (vp.size === 'normal') score += 2;
    }

    // === Divider matching ===
    else if (componentName === 'Divider') {
      if (vp.direction === 'horizontal') score += 3;
      if (vp.size === 'normal') score += 2;
    }

    // === Generic fallback ===
    else {
      if (vp.Interaction === 'default' || vp.interaction === 'default') score += 3;
      if (vp.disabled === 'false') score += 1;
      if (vp.size === 'normal') score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestVariant = variant;
    }
  }

  // If no good match found, try to find default variant
  if (bestScore <= 0) {
    bestVariant = variants.find(v => {
      const vp = parseVariantName(v.name);
      return vp.Interaction === 'default' || vp.interaction === 'default' || vp.status === 'default';
    }) || variants[0];
  }

  return bestVariant;
}

// ============================================================
// Find matching component set
// ============================================================
function findComponentMatch(element) {
  const componentName = element.component;

  // Check mapping
  const mapping = componentMapping[componentName];

  // Explicitly skipped (null) or not in mapping → no match
  if (mapping === null || mapping === undefined) return null;

  let targetName = null;

  if (typeof mapping === 'string') {
    targetName = mapping;
  } else if (typeof mapping === 'object' && mapping.conditional) {
    targetName = mapping.conditional(element);
  }

  if (!targetName) return null;

  // Look up in nameMap
  let componentSet = nameMap.get(targetName);
  if (!componentSet) {
    // Try simplified name
    const simplified = targetName.replace(/^\d+\./, '').replace(/^\s+/, '');
    componentSet = nameMap.get(simplified);
  }

  return componentSet;
}

// ============================================================
// Process all elements
// ============================================================
function processElements(elements) {
  let matchedCount = 0;
  let totalCustomComponents = 0;
  const unmatched = [];

  for (const element of elements) {
    const componentName = element.component;
    const mapping = componentMapping[componentName];

    // Skip explicitly null (charts, custom) and unmapped (HTML elements)
    if (mapping === null || mapping === undefined) continue;

    totalCustomComponents++;
    const componentSet = findComponentMatch(element);

    if (componentSet) {
      const variant = matchVariant(element, componentSet);

      if (variant) {
        element.instance = {
          guid: variant.guid,
          variantKey: variant.variantKey,
          parentKey: variant.parentKey
        };
        matchedCount++;
        console.log(`✓ ${element.id} (${componentName}) → ${componentSet.name} / ${variant.name}`);
      } else {
        unmatched.push(element.id);
        console.log(`✗ ${element.id} (${componentName}) → ${componentSet.name} (no variant match)`);
      }
    } else {
      unmatched.push(element.id);
      console.log(`✗ ${element.id} (${componentName}) → no component set found`);
    }
  }

  return { matchedCount, totalCustomComponents, unmatched };
}

const { matchedCount, totalCustomComponents, unmatched } = processElements(data.elements);

console.log(`\n${'='.repeat(50)}`);
console.log(`匹配结果汇总`);
console.log(`${'='.repeat(50)}`);
console.log(`总元素数: ${data.elements.length}`);
console.log(`自定义组件数: ${totalCustomComponents}`);
console.log(`成功添加instance: ${matchedCount}`);
if (unmatched.length > 0) {
  console.log(`未匹配: ${unmatched.join(', ')}`);
}

fs.writeFileSync('output.json', JSON.stringify(data, null, 2), 'utf-8');
console.log(`\n已保存到 output.json`);