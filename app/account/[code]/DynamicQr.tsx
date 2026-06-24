"use client";

import { useEffect, useState } from "react";

type QrState = {
  qrDataUrl: string;
  expiresAt: string;
  verifyUrl: string;
};

export default function DynamicQr({ passCode }: { passCode: string }) {
  const [qr, setQr] = useState<QrState | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");

  async function loadQr() {
    setError("");

    const response = await fetch("/api/member-qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pass_code: passCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not generate QR");
      setQr(null);
      return;
    }

    setQr(data);
  }

  useEffect(() => {
    loadQr();

    const interval = window.setInterval(() => {
      loadQr();
    }, 25000);

    return () => window.clearInterval(interval);
  }, [passCode]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!qr?.expiresAt) {
        setSecondsLeft(0);
        return;
      }

      const diff = Math.max(
        0,
        Math.floor((new Date(qr.expiresAt).getTime() - Date.now()) / 1000)
      );

      setSecondsLeft(diff);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [qr]);

  if (error) {
    return (
      <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-[3rem] border border-white/10 bg-white p-5 text-black">
      <div className="rounded-[2.4rem] bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-black/40">
              Secure QR
            </p>
            <h2 className="mt-2 text-3xl font-black">Dynamic pass</h2>
          </div>

          <div className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-black">
            {secondsLeft}s
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] bg-white p-4 shadow-xl">
          {qr?.qrDataUrl ? (
            <img
              src={qr.qrDataUrl}
              alt="Dynamic TLN Pass QR"
              className="w-full"
            />
          ) : (
            <div className="flex h-80 items-center justify-center text-black/40">
              Loading QR...
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-sm font-bold text-black/45">
          QR refreshes automatically. Screenshots expire quickly.
        </p>
      </div>
    </div>
  );
}
