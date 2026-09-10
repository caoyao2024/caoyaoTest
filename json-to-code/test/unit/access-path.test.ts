import { describe, it, expect } from 'vitest'
import {
  pathToJsAccess,
  isFlatAccessPath,
  stateRef,
  jsxConstName,
  makeEnrichmentConstName,
  cssModuleRef,
  isValidIdentifier,
  accessPathToJsExpr,
  computedJsxConstName,
} from '../../api/src/core/access-path'
import { Value } from '../../api/src/core/value-factory'

// ─── pathToJsAccess ───

describe('pathToJsAccess', () => {
  it('绝对路径 /a/b/0/c → a.b[0].c', () => {
    expect(pathToJsAccess('/a/b/0/c')).toBe('a.b[0].c')
  })
  it('相对路径 field/0/0/label → field[0][0].label', () => {
    expect(pathToJsAccess('field/0/0/label')).toBe('field[0][0].label')
  })
  it('平面路径 name → name', () => {
    expect(pathToJsAccess('name')).toBe('name')
  })
  it('空/根路径 → 空串', () => {
    expect(pathToJsAccess('')).toBe('')
    expect(pathToJsAccess('/')).toBe('')
  })
})

// ─── isFlatAccessPath ───

describe('isFlatAccessPath', () => {
  it('平面合法标识符 → true', () => {
    expect(isFlatAccessPath('name')).toBe(true)
    expect(isFlatAccessPath('_foo')).toBe(true)
  })
  it('含 . 或 [] 的嵌套 → false', () => {
    expect(isFlatAccessPath('a.b')).toBe(false)
    expect(isFlatAccessPath('a[0]')).toBe(false)
    expect(isFlatAccessPath('a.b[0].c')).toBe(false)
  })
  it('含特殊字符的平面路径（非合法标识符）→ false', () => {
    expect(isFlatAccessPath('a-b')).toBe(false)
    expect(isFlatAccessPath('123abc')).toBe(false)
  })
  it('undefined / null / 空 → false', () => {
    expect(isFlatAccessPath(undefined)).toBe(false)
    expect(isFlatAccessPath(null)).toBe(false)
    expect(isFlatAccessPath('')).toBe(false)
  })
})

// ─── stateRef ───

describe('stateRef', () => {
  it('平面合法标识符 → 裸名（已 destructure）', () => {
    expect(stateRef('name')).toBe('name')
  })
  it('嵌套 → initialState.x.y', () => {
    expect(stateRef('a.b')).toBe('initialState.a.b')
  })
  it('含非标识符段 → bracket 访问', () => {
    expect(stateRef('a-b')).toBe('initialState["a-b"]')
    expect(stateRef('a.b-c')).toBe('initialState.a["b-c"]')
  })
})

// ─── jsxConstName ───

describe('jsxConstName', () => {
  it('平面合法标识符 → 原样', () => {
    expect(jsxConstName('backIcon')).toBe('backIcon')
  })
  it('按非标识符字符切段小驼峰拼接', () => {
    expect(jsxConstName('brandInfo.logoIcon')).toBe('brandInfoLogoIcon')
    expect(jsxConstName('a-b')).toBe('aB')
    expect(jsxConstName('a.b-c')).toBe('aBC')
  })
  it('数字段保留', () => {
    expect(jsxConstName('a[0].b')).toBe('a0B')
  })
  it('undefined/空 → 兜底 jsxConst', () => {
    expect(jsxConstName(undefined)).toBe('jsxConst')
    expect(jsxConstName('')).toBe('jsxConst')
  })
})

// ─── makeEnrichmentConstName ───

describe('makeEnrichmentConstName', () => {
  it('格式 ${topKey}_${parentNodeId}Enriched', () => {
    expect(makeEnrichmentConstName('/tableList', 'hdrTable')).toBe('tableList_hdrTableEnriched')
  })
  it('相对路径取首段', () => {
    expect(makeEnrichmentConstName('masQuickLinks/3', 'hdr')).toBe('masQuickLinks_hdrEnriched')
  })
})

// ─── cssModuleRef ───

describe('cssModuleRef', () => {
  it('合法标识符 → styles.id', () => {
    expect(cssModuleRef('styles', 'root')).toBe('styles.root')
  })
  it('含特殊字符（如 -）→ styles["id"]（避免减法）', () => {
    expect(cssModuleRef('styles', 'root-page')).toBe('styles["root-page"]')
  })
})

// ─── isValidIdentifier ───

describe('isValidIdentifier', () => {
  it('合法标识符', () => {
    expect(isValidIdentifier('foo')).toBe(true)
    expect(isValidIdentifier('_foo')).toBe(true)
    expect(isValidIdentifier('$x')).toBe(true)
  })
  it('非法标识符', () => {
    expect(isValidIdentifier('foo-bar')).toBe(false)
    expect(isValidIdentifier('123abc')).toBe(false)
    expect(isValidIdentifier('')).toBe(false)
    expect(isValidIdentifier('a b')).toBe(false)
  })
})

// ─── accessPathToJsExpr ───

describe('accessPathToJsExpr', () => {
  it('带 base：合法字段 .seg、数字段 [n]、非标识符段 ["seg"]', () => {
    expect(accessPathToJsExpr('a.b', 'base')).toBe('base.a.b')
    expect(accessPathToJsExpr('a[0]', 'base')).toBe('base.a[0]')
    expect(accessPathToJsExpr('a-b', 'base')).toBe('base["a-b"]')
  })
  it('无 base：首段裸（约定已 destructure）', () => {
    expect(accessPathToJsExpr('a.b')).toBe('a.b')
    expect(accessPathToJsExpr('name')).toBe('name')
  })
  it('空 accessPath → base（或空）', () => {
    expect(accessPathToJsExpr('', 'base')).toBe('base')
    expect(accessPathToJsExpr('')).toBe('')
  })
})

// ─── computedJsxConstName ───

describe('computedJsxConstName', () => {
  it('无 identResolver → jsxConstName(accessPath)', () => {
    const cv = Value.computed({
      path: 'p',
      pathType: 'absolute',
      accessPath: 'brandInfo.logoIcon',
      containsJSX: true,
      transform: () => undefined,
    })
    expect(computedJsxConstName(cv)).toBe('brandInfoLogoIcon')
  })
  it('有 identResolver → 调 resolver', () => {
    const cv = Value.computed({
      path: 'p',
      pathType: 'absolute',
      accessPath: 'brandInfo.logoIcon',
      containsJSX: true,
      transform: () => undefined,
      identResolver: () => 'customName',
    })
    expect(computedJsxConstName(cv)).toBe('customName')
  })
})
