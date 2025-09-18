/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function VoiceField({
  label,
  placeholder,
  value,
  onChange,
  extractAfter, // e.g., "জেলা" => if user says "জেলা সিলেট" we take "সিলেট"
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  extractAfter?: string;
}) {
  const [active, setActive] = useState(false);

  function start() {
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
      if (said) {
        if (extractAfter) {
          const m = said.match(new RegExp(`${extractAfter}\\s*(.*)$`));
          onChange((m?.[1] || said).trim());
        } else onChange(said);
      }
      setActive(false);
    };
    r.onerror = () => setActive(false);
    r.onend = () => setActive(false);
    r.start();
  }

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input
          className="w-full rounded-lg border px-3 py-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button type="button" onClick={start} className="rounded-lg border px-3 py-2" title="ভয়েস ইনপুট">
          {active ? "🎙️" : "🎤"}
        </button>
      </div>
    </div>
  );
}
