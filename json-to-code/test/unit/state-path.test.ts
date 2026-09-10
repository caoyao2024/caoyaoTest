import { describe, it, expect } from 'vitest'
import {
  pathToSegments,
  resolveBySegments,
  setNested,
  parseAccessors,
} from '../../api/src/core/state-path'

// ─── pathToSegments ───

describe('pathToSegments', () => {
  it('绝对路径去前导 /', () => {
    expect(pathToSegments('/a/b/0/c')).toEqual(['a', 'b', '0', 'c'])
  })
  it('相对路径原样拆分', () => {
    expect(pathToSegments('a/b')).toEqual(['a', 'b'])
  })
  it('单段', () => {
    expect(pathToSegments('a')).toEqual(['a'])
  })
  it('根路径 → 空', () => {
    expect(pathToSegments('/')).toEqual([])
  })
})

// ─── resolveBySegments ───

describe('resolveBySegments', () => {
  it('逐级取值', () => {
    expect(resolveBySegments({ a: { b: 1 } }, ['a', 'b'])).toBe(1)
  })
  it('中间为 null → undefined', () => {
    expect(resolveBySegments({ a: null }, ['a', 'b'])).toBeUndefined()
  })
  it('不存在 → undefined', () => {
    expect(resolveBySegments({}, ['x', 'y'])).toBeUndefined()
  })
  it('数组下标', () => {
    expect(resolveBySegments({ a: [10, 20] }, ['a', '1'])).toBe(20)
  })
})

// ─── setNested ───

describe('setNested', () => {
  it('嵌套写 a.b[0].c（数组自动建）', () => {
    const obj: any = {}
    setNested(obj, 'a.b[0].c', 'val')
    expect(obj.a.b[0].c).toBe('val')
  })
  it('平面写 name', () => {
    const obj: any = {}
    setNested(obj, 'name', 'val')
    expect(obj.name).toBe('val')
  })
  it('连续数字下标 a[0][1]', () => {
    const obj: any = {}
    setNested(obj, 'a[0][1]', 'val')
    expect(obj.a[0][1]).toBe('val')
    expect(Array.isArray(obj.a)).toBe(true)
    expect(Array.isArray(obj.a[0])).toBe(true)
  })
  it('不覆盖已存在的中间结构', () => {
    const obj: any = { a: { existing: true } }
    setNested(obj, 'a.b', 'val')
    expect(obj.a.existing).toBe(true)
    expect(obj.a.b).toBe('val')
  })
})

// ─── parseAccessors ───

describe('parseAccessors', () => {
  it('a.b[0].c → 字段/字段/索引/字段', () => {
    expect(parseAccessors('a.b[0].c')).toEqual([
      { kind: 'field', field: 'a' },
      { kind: 'field', field: 'b' },
      { kind: 'index', index: 0 },
      { kind: 'field', field: 'c' },
    ])
  })
  it('a[0][1].c → 连续索引', () => {
    expect(parseAccessors('a[0][1].c')).toEqual([
      { kind: 'field', field: 'a' },
      { kind: 'index', index: 0 },
      { kind: 'index', index: 1 },
      { kind: 'field', field: 'c' },
    ])
  })
  it('name → 单字段', () => {
    expect(parseAccessors('name')).toEqual([{ kind: 'field', field: 'name' }])
  })
  it('空串 → 空', () => {
    expect(parseAccessors('')).toEqual([])
  })
})
