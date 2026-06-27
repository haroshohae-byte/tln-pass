"use client";

import { useState } from "react";

export default function ImagePreviewInput({
  name,
  label,
  currentUrl,
}: {
  name: string;
  label: string;
  currentUrl?: string | null;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState("");

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setPreviewUrl(currentUrl || null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      event.target.value = "";
      setError("Use JPG, PNG or WebP.");
      setPreviewUrl(currentUrl || null);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      event.target.value = "";
      setError("Image must be under 4 MB.");
      setPreviewUrl(currentUrl || null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-400">
        {label}
      </label>

      <div className="mb-3 overflow-hidden rounded-2xl border border-white/10 bg-black">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="h-44 w-full object-cover" />
        ) : (
          <div className="grid h-44 place-items-center bg-[linear-gradient(135deg,#27272a,#09090b)] text-sm font-black uppercase tracking-[0.22em] text-zinc-500">
            Image preview
          </div>
        )}
      </div>

      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
        className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-bold file:text-black"
      />

      {error && <p className="mt-2 text-sm font-bold text-red-300">{error}</p>}
    </div>
  );
}
