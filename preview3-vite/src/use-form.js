// Layer 1 — 轻量表单状态（不依赖 antd Form / Form.Item）
// 负责：值收集、字段校验、错误信息、必填判定
// 约定 schema 结构：
//   { fieldName: [rule, ...] }                     // 普通字段
//   { fieldName: { when, rules: [rule, ...] } }    // 条件字段（when 返回 false 时不校验）
// rule 支持的键：required / min / max / pattern / type("email") / message

import { useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmpty(value) {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function checkRule(rule, value) {
  if (rule.required && (isEmpty(value) || value === false)) return rule.message || "该字段为必填项";
  if (isEmpty(value)) return ""; // 非必填且为空 → 跳过后续规则
  if (rule.min !== undefined) {
    const len = typeof value === "number" ? value : String(value).length;
    if (len < rule.min) return rule.message;
  }
  if (rule.max !== undefined) {
    const len = typeof value === "number" ? value : String(value).length;
    if (len > rule.max) return rule.message;
  }
  if (rule.pattern && !rule.pattern.test(String(value))) return rule.message;
  if (rule.type === "email" && !EMAIL_RE.test(String(value))) return rule.message;
  return "";
}

function rulesOf(entry) {
  if (!entry) return [];
  return Array.isArray(entry) ? entry : entry.rules || [];
}

function whenOf(entry) {
  if (!entry || Array.isArray(entry)) return null;
  return typeof entry.when === "function" ? entry.when : null;
}

export function useForm(schema, initialValues) {
  const initial = useRef(initialValues || {});
  const valuesRef = useRef(initial.current);
  const touchedRef = useRef({});

  const [values, setValuesState] = useState(initial.current);
  const [errors, setErrors] = useState({});
  const [touched, setTouchedState] = useState({});

  function messageOf(name, all) {
    const entry = schema[name];
    const when = whenOf(entry);
    if (when && !when(all)) return "";
    const rules = rulesOf(entry);
    for (let i = 0; i < rules.length; i += 1) {
      const msg = checkRule(rules[i], all[name]);
      if (msg) return msg;
    }
    return "";
  }

  function commit(next) {
    valuesRef.current = next;
    setValuesState(next);
    return next;
  }

  // 单字段写入：已触碰过的字段即时复校，未触碰的保持安静（不打断输入）
  function setValue(name, value) {
    const next = commit(Object.assign({}, valuesRef.current, { [name]: value }));
    if (touchedRef.current[name]) {
      const msg = messageOf(name, next);
      setErrors(function (prev) { return Object.assign({}, prev, { [name]: msg }); });
    }
  }

  // 批量写入（智能填充 / 联动重置）
  function setValues(patch) {
    const next = commit(Object.assign({}, valuesRef.current, patch));
    const nextErrors = {};
    Object.keys(schema).forEach(function (key) {
      if (touchedRef.current[key]) nextErrors[key] = messageOf(key, next);
    });
    setErrors(nextErrors);
  }

  // 失焦时标记字段并校验
  function touch(name) {
    touchedRef.current = Object.assign({}, touchedRef.current, { [name]: true });
    setTouchedState(touchedRef.current);
    const msg = messageOf(name, valuesRef.current);
    setErrors(function (prev) { return Object.assign({}, prev, { [name]: msg }); });
  }

  // 全量校验（提交时）— 返回首个出错字段名，便于滚动定位
  function validate() {
    const all = valuesRef.current;
    const nextErrors = {};
    const nextTouched = {};
    let firstError = "";
    Object.keys(schema).forEach(function (key) {
      nextTouched[key] = true;
      const msg = messageOf(key, all);
      nextErrors[key] = msg;
      if (msg && !firstError) firstError = key;
    });
    touchedRef.current = nextTouched;
    setTouchedState(nextTouched);
    setErrors(nextErrors);
    return { ok: !firstError, firstError: firstError, values: all };
  }

  function clearErrors() {
    touchedRef.current = {};
    setTouchedState({});
    setErrors({});
  }

  function reset() {
    commit(initial.current);
    clearErrors();
  }

  function required(name) {
    const entry = schema[name];
    const when = whenOf(entry);
    if (when && !when(valuesRef.current)) return false;
    return rulesOf(entry).some(function (r) { return !!r.required; });
  }

  return {
    values: values,
    errors: errors,
    touched: touched,
    setValue: setValue,
    setValues: setValues,
    touch: touch,
    validate: validate,
    reset: reset,
    clearErrors: clearErrors,
    required: required,
  };
}
