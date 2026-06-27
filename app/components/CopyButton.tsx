"use client";

import { useState } from "react";

export default function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className = "",
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className={
        className ||
        "rounded-full bg-black px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
