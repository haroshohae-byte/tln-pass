"use client";

import { useState } from "react";

const discountTypes = ["none", "percent", "euro", "custom"] as const;
type DiscountType = (typeof discountTypes)[number];

export type DiscountFieldsCopy = {
  type: string;
  value: string;
  none: string;
  percent: string;
  euro: string;
  custom: string;
  customPlaceholder: string;
};

function isDiscountType(value?: string | null): value is DiscountType {
  return discountTypes.some((type) => type === value);
}

export default function DiscountFields({
  defaultType,
  defaultValue,
  defaultCustom,
  copy,
}: {
  defaultType?: string | null;
  defaultValue?: number | string | null;
  defaultCustom?: string | null;
  copy: DiscountFieldsCopy;
}) {
  const safeDefault = isDiscountType(defaultType) ? defaultType : "none";
  const [type, setType] = useState<DiscountType>(safeDefault);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-zinc-400">
          {copy.type}
        </span>
        <select
        suppressHydrationWarning
          name="discount_type"
          value={type}
          onChange={(event) =>
            setType(event.target.value as DiscountType)
          }
          className="field"
        >
          <option value="none">{copy.none}</option>
          <option value="percent">{copy.percent}</option>
          <option value="euro">{copy.euro}</option>
          <option value="custom">{copy.custom}</option>
        </select>
      </label>

      {type === "percent" && (
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-zinc-400">
            {copy.value}
          </span>
          <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-black focus-within:border-white/35">
            <input
        suppressHydrationWarning
              name="discount_value"
              type="text"
              inputMode="decimal"
              pattern="^\d+(\.\d{1,2})?$"
              minLength={1}
              defaultValue={defaultValue || ""}
              placeholder="20"
              className="w-full bg-transparent px-5 py-4 text-white outline-none"
            />
            <span className="grid place-items-center px-5 font-black text-zinc-500">
              %
            </span>
          </div>
        </label>
      )}

      {type === "euro" && (
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-zinc-400">
            {copy.value}
          </span>
          <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-black focus-within:border-white/35">
            <input
        suppressHydrationWarning
              name="discount_value"
              type="text"
              inputMode="decimal"
              pattern="^\d+(\.\d{1,2})?$"
              defaultValue={defaultValue || ""}
              placeholder="5.00"
              className="w-full bg-transparent px-5 py-4 text-white outline-none"
            />
            <span className="grid place-items-center px-5 font-black text-zinc-500">
              €
            </span>
          </div>
        </label>
      )}

      {type === "custom" && (
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-zinc-400">
            {copy.value}
          </span>
          <input
        suppressHydrationWarning
            name="discount_custom"
            type="text"
            defaultValue={defaultCustom || ""}
            placeholder={copy.customPlaceholder}
            className="field"
          />
        </label>
      )}
    </div>
  );
}
