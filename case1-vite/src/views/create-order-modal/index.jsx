// Layer 4: 新建订单弹窗 — 快捷创建落地表单（H5 骨架 + eview-react 输入组件受控校验）
// 提交后由 order-console 生成真实订单进入主表，页签角标 / 概览卡同步联动
import { useState } from "react";
import Button from "@nce/eview-react/Button";
import Dialog from "@nce/eview-react/Dialog";
import TextField from "@/shared/TextField";
import Spinner from "@/shared/Spinner";
import Select from "@/shared/Select";
import InputSelect from "@/shared/InputSelect";
import { CATALOG_OPTIONS, PAY_METHODS, SLOT_OPTIONS } from "../../mock/order.js";
// 表单骨架 .fm / .fm-grid 定义于 order-console/index.css（页面级共享）

const EMPTY_FORM = {
  receiver: "",
  phone: "",
  productKey: null,
  qty: 1,
  payMethod: null,
  slot: null,
  address: "",
};

export default function CreateOrderModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const submit = () => {
    const errs = {};
    if (!form.receiver.trim()) errs.receiver = "请输入收货人姓名";
    if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) errs.phone = "请输入 11 位有效手机号";
    if (!form.productKey) errs.productKey = "请选择商品";
    if (!form.qty || form.qty < 1) errs.qty = "数量至少为 1";
    if (!form.payMethod) errs.payMethod = "请选择支付方式";
    if (!form.slot) errs.slot = "请选择预约配送时段";
    if (!form.address.trim()) errs.address = "请输入详细收货地址";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({
      receiver: form.receiver.trim(),
      phone: form.phone.trim(),
      productKey: form.productKey,
      qty: form.qty,
      payMethod: form.payMethod,
      slot: form.slot,
      address: form.address.trim(),
    });
    reset();
  };

  return (
    <Dialog
      isOpen={open}
      title="新建订单"
      size={[560, "auto"]}
      onClose={() => {
        reset();
        onClose();
      }}
      buttons={[
        {
          text: "取消",
          onClick: () => {
            reset();
            onClose();
          },
        },
        { text: "创建订单", status: "primary", onClick: submit },
      ]}
    >
      <form
        className="fm fm-grid"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="fm-field">
          <label className="fm-label fm-required" htmlFor="co-receiver">
            收货人
          </label>
          <TextField
            id="co-receiver"
            value={form.receiver}
            className={errors.receiver ? "fm-input-error" : undefined}
            defaultLabel="请输入收货人姓名"
            onChange={(val) => setField("receiver", val)}
          />
          {errors.receiver && <div className="fm-error">{errors.receiver}</div>}
        </div>
        <div className="fm-field">
          <label className="fm-label fm-required" htmlFor="co-phone">
            手机号
          </label>
          <TextField
            id="co-phone"
            value={form.phone}
            className={errors.phone ? "fm-input-error" : undefined}
            defaultLabel="请输入 11 位手机号"
            onChange={(val) => setField("phone", val)}
          />
          {errors.phone && <div className="fm-error">{errors.phone}</div>}
        </div>
        <div className="fm-field fm-field-wide">
          <label className="fm-label fm-required" htmlFor="co-product">
            商品
          </label>
          <InputSelect
            id="co-product"
            onlySelect
            defaultLabel="搜索并选择商品"
            style={{ width: "100%" }}
            options={CATALOG_OPTIONS.map((o) => ({ value: o.value, text: o.label }))}
            value={form.productKey}
            className={errors.productKey ? "fm-input-error" : undefined}
            onChange={(v) => setField("productKey", v)}
          />
          {errors.productKey && <div className="fm-error">{errors.productKey}</div>}
        </div>
        <div className="fm-field">
          <label className="fm-label fm-required" htmlFor="co-qty">
            数量
          </label>
          <Spinner
            id="co-qty"
            min={1}
            max={99}
            style={{ width: "100%" }}
            value={form.qty}
            className={errors.qty ? "fm-input-error" : undefined}
            onChange={(v) => setField("qty", v)}
          />
          {errors.qty && <div className="fm-error">{errors.qty}</div>}
        </div>
        <div className="fm-field">
          <label className="fm-label fm-required" htmlFor="co-pay">
            支付方式
          </label>
          <Select
            id="co-pay"
            defaultLabel="请选择"
            style={{ width: "100%" }}
            options={PAY_METHODS.map((m) => ({ value: m, text: m }))}
            value={form.payMethod}
            className={errors.payMethod ? "fm-input-error" : undefined}
            onChange={(v) => setField("payMethod", v)}
          />
          {errors.payMethod && <div className="fm-error">{errors.payMethod}</div>}
        </div>
        <div className="fm-field">
          <label className="fm-label fm-required" htmlFor="co-slot">
            预约配送时段
          </label>
          <Select
            id="co-slot"
            defaultLabel="请选择时段"
            style={{ width: "100%" }}
            options={SLOT_OPTIONS.map((s) => ({ value: s.value, text: s.label }))}
            value={form.slot}
            className={errors.slot ? "fm-input-error" : undefined}
            onChange={(v) => setField("slot", v)}
          />
          {errors.slot && <div className="fm-error">{errors.slot}</div>}
        </div>
        <div className="fm-field fm-field-wide">
          <label className="fm-label fm-required" htmlFor="co-address">
            详细地址
          </label>
          <TextField
            id="co-address"
            value={form.address}
            className={errors.address ? "fm-input-error" : undefined}
            defaultLabel="省 / 市 / 区 + 街道门牌"
            onChange={(val) => setField("address", val)}
          />
          {errors.address && <div className="fm-error">{errors.address}</div>}
        </div>
      </form>
    </Dialog>
  );
}
