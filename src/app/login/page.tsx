/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  mobileVerify,
  otpSend,
  registerUser,
  savePhoneLocal,
  saveJwtLocal,
  resendOtp,
} from "@/app/utils/api";

type NewUserPayload = {
  name: string;
  district: string;
  crops: string[];
};

const CROPS = [
  { key: "ধান", label: "ধান 🌾" },
  { key: "আলু", label: "আলু 🥔" },
  { key: "বেগুন", label: "বেগুন 🍆" },
  { key: "টমেটো", label: "টমেটো 🍅" },
  { key: "পেয়াজ", label: "পেয়াজ 🧅" },
  { key: "রসুন", label: "রসুন 🧄" },
  { key: "ডিম/পোল্ট্রি", label: "পোল্ট্রি 🐔" },
];

// --- Speech Recognition helper (Bangla, one-shot) ---
function useBanglaRecognizer() {
  const [active, setActive] = useState(false);
  function recognizeOnce(onResult: (text: string) => void) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই।");
      return;
    }
    const r = new SR();
    r.lang = "bn-BD";
    r.interimResults = false;
    r.maxAlternatives = 1;
    setActive(true);
    r.onresult = (e: any) => {
      const said = (e?.results?.[0]?.[0]?.transcript || "").trim();
      if (said) onResult(said);
      setActive(false);
    };
    r.onerror = () => setActive(false);
    r.onend = () => setActive(false);
    r.start();
  }
  return { recognizeOnce, active };
}

export default function LoginPage() {
  const [phone, setPhone] = useState("+8801");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Registration modal state (blocking when shown)
  const [showRegister, setShowRegister] = useState(false);
  const [reg, setReg] = useState<NewUserPayload>({ name: "", district: "", crops: [] });

  // Voice helper for modal fields
  const { recognizeOnce, active: voiceActive } = useBanglaRecognizer();

  // 5-minute timer after OTP send
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const remaining = useRemaining(expiresAt); // mm:ss

  // Load stored phone if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cb_phone");
      if (stored) setPhone(stored);
    } catch {}
  }, []);

  function toggleCrop(k: string) {
    setReg((prev) => {
      const has = prev.crops.includes(k);
      return { ...prev, crops: has ? prev.crops.filter((x) => x !== k) : [...prev.crops, k] };
    });
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      savePhoneLocal(phone);
      const res = await mobileVerify(phone);
      if (!res.ok) throw new Error(res.message || "Failed to send OTP");

      setSent(true);
      setExpiresAt(Date.now() + 5 * 60 * 1000);
    } catch (e: any) {
      setErr(e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await otpSend(phone, code);

      if (res.status === "error") throw new Error(res.message);

      if (res.status === "registered") {
        saveJwtLocal(res.token);
        window.location.href = "/";
        return;
      }

      if (res.status === "unregistered") {
        // 🔒 Show BLOCKING registration modal (no close/click-away)
        setShowRegister(true);
      }
    } catch (e: any) {
      setErr(e.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      setErr(null);
      setLoading(true);
      setCode("");
      const res = await mobileVerify(phone);
      if (!res.ok) throw new Error(res.message || "OTP resend failed");
      setSent(true);
      setExpiresAt(Date.now() + 5 * 60 * 1000);
    } catch (e: any) {
      setErr(e.message || "পুনরায় পাঠানো যায়নি");
    } finally {
      setLoading(false);
    }
  }

  async function submitRegistration() {
    try {
      setLoading(true);
      setErr(null);

      if (!reg.name || !reg.district || reg.crops.length === 0) {
        setErr("নাম, জেলা ও অন্তত ১টি ফসল নির্বাচন করুন।");
        return;
      }

      const out = await registerUser({
        phone,
        name: reg.name,
        district: reg.district,
        preferredCrops: reg.crops,
      });

      if (!out.ok) throw new Error(out.message);

      saveJwtLocal(out.token);
      setShowRegister(false); // closes only after success
      window.location.href = "/";
    } catch (e: any) {
      setErr(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "লগইন";

  return (
    <>
      <Navbar />
      <main className={`mx-auto max-w-7xl px-4 py-10 ${showRegister ? "pointer-events-none blur-[1px]" : ""}`}>
        <h1 className="text-2xl font-semibold">লগইন (ফোন OTP)</h1>
        <p className="text-gray-600 mt-2">
          ঐচ্ছিক — ফোন নম্বর দিয়ে লগইন করলে আপনার ডেটা সব সংরক্ষিত থাকবে।
        </p>

        <div className="mt-6 max-w-md rounded-2xl border bg-white p-6">
          {!sent ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <label className="block text-sm font-medium">Phone (E.164)</label>
              <input
                type="tel"
                className="w-full rounded-lg border px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "পাঠানো হচ্ছে…" : "OTP পাঠান"}
              </button>
              {err && <div className="text-sm text-red-600">{err}</div>}
              <p className="text-xs text-gray-500">
                আমরা আপনার নম্বরে OTP পাঠাবো {appName} নিশ্চিত করতে।
              </p>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div className="text-sm text-gray-600">
                নম্বর: <span className="font-medium">{phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">OTP কোড (৬ সংখ্যা)</label>
                <span className="text-xs text-gray-600">সময় বাকি: {remaining}</span>
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="w-full rounded-lg border px-3 py-2 tracking-widest"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
              />

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {loading ? "যাচাই করা হচ্ছে…" : "যাচাই করুন"}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-gray-600 underline"
                  title="পুনরায় OTP পাঠান"
                >
                  পুনরায় পাঠান
                </button>
              </div>

              {err && <div className="text-sm text-red-600">{err}</div>}
            </form>
          )}
        </div>
      </main>
      <Footer />

      {/* 🔒 BLOCKING Registration Modal */}
      {showRegister && (
        <BlockingModal title="নতুন ব্যবহারকারী — নিবন্ধন করুন (অবশ্যই পূরণ করুন)">
          <div className="space-y-4">
            {/* Voice prompt */}
            <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm">
              👉 <strong>ভয়েসে বলুন</strong>: “আমার নাম [আপনার নাম]”, “জেলা [আপনার জেলা]”
            </div>

            {/* Name + voice capture */}
            <div>
              <label className="block text-sm font-medium">নাম</label>
              <div className="flex gap-2">
                <input
                  className="w-full rounded-lg border px-3 py-2"
                  value={reg.name}
                  onChange={(e) => setReg((p) => ({ ...p, name: e.target.value }))}
                  placeholder="আপনার নাম"
                />
                <button
                  type="button"
                  onClick={() =>
                    recognizeOnce((txt) => {
                      // try extract after "নাম" word if user speaks a sentence
                      const m = txt.match(/নাম\s*(.*)$/);
                      setReg((p) => ({ ...p, name: (m?.[1] || txt).trim() }));
                    })
                  }
                  className="rounded-lg border px-3 py-2"
                  title="নাম বলুন"
                >
                  {voiceActive ? "🎙️" : "🎤"}
                </button>
              </div>
            </div>

            {/* District + voice capture */}
            <div>
              <label className="block text-sm font-medium">জেলা</label>
              <div className="flex gap-2">
                <input
                  className="w-full rounded-lg border px-3 py-2"
                  value={reg.district}
                  onChange={(e) => setReg((p) => ({ ...p, district: e.target.value }))}
                  placeholder="উদাহরণ: সিলেট"
                />
                <button
                  type="button"
                  onClick={() =>
                    recognizeOnce((txt) => {
                      const m = txt.match(/জেলা\s*(.*)$/);
                      setReg((p) => ({ ...p, district: (m?.[1] || txt).trim() }));
                    })
                  }
                  className="rounded-lg border px-3 py-2"
                  title="জেলা বলুন"
                >
                  {voiceActive ? "🎙️" : "🎤"}
                </button>
              </div>
            </div>

            {/* Crops */}
            <div>
              <div className="text-sm font-medium mb-2">আপনার ফসল (একাধিক নির্বাচন)</div>
              <div className="grid grid-cols-2 gap-2">
                {CROPS.map((c) => {
                  const active = reg.crops.includes(c.key);
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => toggleCrop(c.key)}
                      className={`rounded-lg border px-3 py-2 text-left ${active ? "bg-emerald-50 border-emerald-300" : "bg-white"}`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <div className="flex items-center gap-3">
              <button
                onClick={submitRegistration}
                disabled={loading}
                className="rounded-full px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "নিবন্ধন হচ্ছে…" : "নিবন্ধন সম্পূর্ণ করুন"}
              </button>
              {/* No cancel/close button → blocking until registration succeeds */}
            </div>
          </div>
        </BlockingModal>
      )}
    </>
  );
}

/* ---------- helpers ---------- */

function useRemaining(expiresAt: number | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!expiresAt) return "05:00";
  const ms = Math.max(expiresAt - now, 0);
  const mm = Math.floor(ms / 60000);
  const ss = Math.floor((ms % 60000) / 1000);
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

// 🔒 Modal that cannot be closed or dismissed by clicking outside
function BlockingModal({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop without click-to-close */}
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reg-title"
      >
        <div className="flex items-center justify-between">
          <div id="reg-title" className="text-lg font-semibold">
            {title}
          </div>
          {/* No close (×) button — blocking */}
          <div className="text-xs text-gray-500">অবশ্যই পূরণ করুন</div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
