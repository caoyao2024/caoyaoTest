import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IconCollector, setIconPackage } from '../../api/src/core/icon-collection'

// ═══════════════════════════════════════════════════════════════════
// eview-ui 图标真实化：resolveAll 在 iconPkg==='@hui/icon-plus' 时按 getIconInfo
// 返回的 url 直取 SVG 文本，存入 iconSvgMap（供 GenerateIconAssets 发射
// public/icons/<name>.svg）。fetch 失败的 name 优雅跳过（不进 iconSvgMap）。
// eview-react（@nce/icon-plus）不下载 SVG，iconSvgMap 空。
//
// setup.ts 全局 stub fetch 恒 reject；本文件 beforeEach 用 vi.stubGlobal 覆盖为受控
// 响应，afterEach 还原回 setup 的 reject stub，避免污染其它测试。
// ═══════════════════════════════════════════════════════════════════

describe('IconCollector.resolveAll — eview-ui SVG 下载', () => {
  let originalFetch: any
  beforeEach(() => {
    originalFetch = (globalThis as any).fetch
    setIconPackage('@hui/icon-plus') // eview-ui → 触发 SVG 下载
  })
  afterEach(() => {
    vi.stubGlobal('fetch', originalFetch) // 还原 setup 的 reject stub
    setIconPackage('@nce/icon-plus') // 还原默认，避免污染其它测试
  })

  it('getIconInfo 返回 url → 下载 SVG 文本存入 iconSvgMap；iconNameMap 同步填充', async () => {
    vi.stubGlobal('fetch', (url: string) => {
      if (url.includes('getIconInfo')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'home', icons: [{ name: 'ic_home', url: 'http://x/home.svg', group: ['系统图标'] }] },
          ]),
        })
      }
      // svg 下载
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<svg><path/></svg>') })
    })

    const c = new IconCollector()
    c.collectFromNodeProps('Button', { icon: 'home' })
    const { iconNameMap, iconSvgMap } = await c.resolveAll()
    expect(iconNameMap['home']).toBe('IconPlusIcHome')
    expect(iconSvgMap['home']).toBe('<svg><path/></svg>')
  })

  it('svg 下载失败（fetch reject）→ name 不进 iconSvgMap，iconNameMap 仍填充', async () => {
    vi.stubGlobal('fetch', (url: string) => {
      if (url.includes('getIconInfo')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'bad', icons: [{ name: 'ic_bad', url: 'http://x/bad.svg', group: ['系统图标'] }] },
          ]),
        })
      }
      return Promise.reject(new Error('network'))
    })
    const c = new IconCollector()
    c.collectFromNodeProps('Button', { icon: 'bad' })
    const { iconNameMap, iconSvgMap } = await c.resolveAll()
    expect(iconNameMap['bad']).toBe('IconPlusIcBad')
    expect(iconSvgMap['bad']).toBeUndefined()
  })

  it('svg 响应非 svg 文本（无 <svg）→ 跳过', async () => {
    vi.stubGlobal('fetch', (url: string) => {
      if (url.includes('getIconInfo')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'nope', icons: [{ name: 'ic_nope', url: 'http://x/nope.svg', group: ['系统图标'] }] },
          ]),
        })
      }
      return Promise.resolve({ ok: true, text: () => Promise.resolve('not an svg') })
    })
    const c = new IconCollector()
    c.collectFromNodeProps('Button', { icon: 'nope' })
    const { iconSvgMap } = await c.resolveAll()
    expect(iconSvgMap['nope']).toBeUndefined()
  })

  it('eview-react（iconPkg=@nce/icon-plus）→ 不下载 SVG，iconSvgMap 空（iconNameMap 仍填充）', async () => {
    setIconPackage('@nce/icon-plus')
    let svgFetched = false
    vi.stubGlobal('fetch', (url: string) => {
      if (url.includes('getIconInfo')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { keyword: 'home', icons: [{ name: 'ic_home', url: 'http://x/home.svg', group: ['系统图标'] }] },
          ]),
        })
      }
      svgFetched = true
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<svg/>') })
    })
    const c = new IconCollector()
    c.collectFromNodeProps('Button', { icon: 'home' })
    const { iconNameMap, iconSvgMap } = await c.resolveAll()
    expect(iconNameMap['home']).toBe('IconPlusIcHome')
    expect(Object.keys(iconSvgMap)).toHaveLength(0)
    expect(svgFetched).toBe(false) // eview-react 网关跳过 SVG 下载
  })
})
