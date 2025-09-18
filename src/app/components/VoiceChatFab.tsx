"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
    responsiveVoice?: any;
  }
}

type Phase = "idle" | "listening" | "thinking" | "speaking";

export default function VoiceChatFab() {
  const [phase, setPhase] = useState<Phase>("idle");
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "bn-BD";
    r.interimResults = false;
    r.maxAlternatives = 1;

    r.onstart = () => setPhase("listening");
    r.onresult = async (e: any) => {
      const said = e?.results?.[0]?.[0]?.transcript?.trim();
      if (!said) {
        setPhase("idle");
        return;
      }
      setPhase("thinking");
      try {
        const { chatWithAi } = await import("@/app/utils/api");
        const res = await chatWithAi(said);
        await speak(res.text || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।");
      } catch {
        await speak("দুঃখিত, সার্ভার থেকে উত্তর আনা যায়নি।");
      } finally {
        setPhase("idle");
      }
    };
    r.onerror = () => setPhase("idle");
    r.onend = () => {
      if (phase === "listening") setPhase("idle");
    };

    recogRef.current = r;
  }, [phase]);

  function toggle() {
    const r = recogRef.current;
    if (!r) {
      alert("আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই।");
      return;
    }
    if (phase === "listening") {
      r.stop();
      setPhase("idle");
    } else {
      r.start();
    }
  }

  async function speak(text: string) {
    try {
      setPhase("speaking");
      if (window.responsiveVoice) {
        return new Promise<void>((resolve) => {
          window.responsiveVoice.speak(text, "Bangla Bangladesh Female", {
            rate: 0.9,
            pitch: 1.0,
            volume: 1.0,
            onend: () => resolve(),
            onerror: () => resolve(),
          });
        });
      }
      const s = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      const voices = s.getVoices();
      const bn =
        voices.find(v => v.lang === "bn-BD" || v.name.toLowerCase().includes("bengali") || v.lang.includes("bn")) ||
        voices.find(v => v.lang === "hi-IN" || v.name.toLowerCase().includes("hindi")) ||
        voices.find(v => v.lang.includes("in") || v.name.toLowerCase().includes("india")) ||
        voices.find(v => v.default) ||
        voices[0];

      if (bn) {
        u.lang = bn.lang;
        u.voice = bn;
      } else {
        u.lang = "bn-BD";
      }
      u.rate = 0.85;
      return new Promise<void>((resolve) => {
        u.onend = () => resolve();
        u.onerror = () => resolve();
        s.speak(u);
      });
    } finally {
      setPhase("idle");
    }
  }

  const label =
    phase === "idle" ? "🎧"
    : phase === "listening" ? "🎙️"
    : phase === "thinking" ? "⏳"
    : "🔊";

  return (
    <button
      onClick={toggle}
      aria-label="Voice chat with AI"
      className="fixed bottom-24 right-6 rounded-full shadow-lg border bg-white w-14 h-14 flex items-center justify-center text-2xl"
      title="ভয়েস চ্যাট — বলুন প্রশ্ন করুন"
    >
      <span className="relative">
        {label}
        {phase !== "idle" && (
          <span className="absolute -inset-3 rounded-full animate-ping bg-emerald-200" />
        )}
      </span>
    </button>
  );
}
