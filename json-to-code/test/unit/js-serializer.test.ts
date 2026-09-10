import { describe, it, expect } from 'vitest'
import { needsQuote, emitKey, serializePlainJs } from '../../api/src/codegen/js-serializer'

// ─── needsQuote ───

describe('needsQuote', () => {
  it('合法标识符 → false', () => {
    expect(needsQuote('foo')).toBe(false)
    expect(needsQuote('_foo')).toBe(false)
    expect(needsQuote('$x')).toBe(false)
  })
  it('JS 保留字 → true', () => {
    expect(needsQuote('class')).toBe(true)
    expect(needsQuote('const')).toBe(true)
    expect(needsQuote('return')).toBe(true)
    expect(needsQuote('null')).toBe(true)
    expect(needsQuote('true')).toBe(true)
  })
  it('首字符为数字 → true', () => {
    expect(needsQuote('123abc')).toBe(true)
    expect(needsQuote('1foo')).toBe(true)
  })
  it('含特殊字符 → true', () => {
    expect(needsQuote('a-b')).toBe(true)
    expect(needsQuote('a.b')).toBe(true)
    expect(needsQuote('a b')).toBe(true)
  })
  it('空串 → true', () => {
    expect(needsQuote('')).toBe(true)
  })
})

// ─── emitKey ───

describe('emitKey', () => {
  it('合法标识符 → 裸', () => {
    expect(emitKey('foo')).toBe('foo')
  })
  it('保留字 → 引号', () => {
    expect(emitKey('class')).toBe('"class"')
  })
  it('特殊字符 → 引号', () => {
    expect(emitKey('a-b')).toBe('"a-b"')
    expect(emitKey('123')).toBe('"123"')
  })
})

// ─── serializePlainJs ───

describe('serializePlainJs', () => {
  it('null / undefined → null', () => {
    expect(serializePlainJs(null)).toBe('null')
    expect(serializePlainJs(undefined)).toBe('null')
  })
  it('字符串/数字/布尔', () => {
    expect(serializePlainJs('str')).toBe('"str"')
    expect(serializePlainJs(42)).toBe('42')
    expect(serializePlainJs(true)).toBe('true')
  })
  it('函数 → null（回退）', () => {
    expect(serializePlainJs(() => 1)).toBe('null')
  })
  it('空数组/空对象', () => {
    expect(serializePlainJs([])).toBe('[]')
    expect(serializePlainJs({})).toBe('{}')
  })
  it('数组缩进序列化', () => {
    expect(serializePlainJs([1, 2])).toBe('[\n  1,\n  2\n]')
  })
  it('对象缩进序列化，key 按需加引号', () => {
    expect(serializePlainJs({ a: 1, 'b-c': 2 })).toBe('{\n  a: 1,\n  "b-c": 2\n}')
  })
  it('嵌套对象', () => {
    expect(serializePlainJs({ a: { b: 1 } })).toBe('{\n  a: {\n    b: 1\n  }\n}')
  })
  it('过滤 __ 前缀的内部键（如 __node brand）', () => {
    expect(serializePlainJs({ __node: true, a: 1 })).toBe('{\n  a: 1\n}')
  })
  it('只有 __ 前缀键的对象 → {}', () => {
    expect(serializePlainJs({ __node: true })).toBe('{}')
  })
})
