"use client";

import { useSyncExternalStore } from "react";

type JoinCheckoutFormLabels = {
  name: string;
  email: string;
  button: string;
};

function subscribeToHydration() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function JoinCheckoutForm({
  action,
  planId,
  labels,
}: {
  action: (formData: FormData) => void | Promise<void>;
  planId: string;
  labels: JoinCheckoutFormLabels;
}) {
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) {
    return (
      <div className="mt-6 space-y-4" aria-hidden="true">
        <div className="h-[58px] rounded-2xl bg-zinc-100" />
        <div className="h-[58px] rounded-2xl bg-zinc-100" />
        <div className="h-[64px] rounded-full bg-black" />
      </div>
    );
  }

  return (
    <form action={action} className="mt-6 space-y-4">
      <input suppressHydrationWarning type="hidden" name="plan" value={planId} />

      <input
        suppressHydrationWarning
        autoComplete="name"
        name="full_name"
        type="text"
        required
        placeholder={labels.name}
        className="w-full rounded-2xl border border-black/10 bg-zinc-100 px-5 py-4 font-bold text-black outline-none placeholder:text-zinc-500 focus:border-black/30"
      />

      <input
        suppressHydrationWarning
        autoComplete="email"
        name="email"
        type="email"
        required
        placeholder={labels.email}
        className="w-full rounded-2xl border border-black/10 bg-zinc-100 px-5 py-4 font-bold text-black outline-none placeholder:text-zinc-500 focus:border-black/30"
      />

      <button
        type="submit"
        className="w-full rounded-full bg-black px-8 py-5 font-black text-white transition hover:scale-[1.02]"
      >
        {labels.button}
      </button>
    </form>
  );
}
