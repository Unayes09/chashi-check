/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export default function VoiceFab() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.lang = "bn-BD";
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.onresult = (e: any) => {
        const said = e.results[0][0].transcript.toLowerCase();
        // Simple intents (extend later)
        if (said.includes("বাজার") || said.includes("দর")) router.push("/market");
        else if (said.includes("আবহাওয়া") || said.includes("বৃষ্টি")) router.push("/weather");
        else if (said.includes("শিখ")) router.push("/learn");
        else if (said.includes("কমিউনিটি") || said.includes("ফোরাম")) router.push("/community");
        else if (said.includes("লগইন") || said.includes("লগ ইন") || said.includes("লগিন")) router.push("/login");
        else router.push(`/search?q=${encodeURIComponent(said)}`);
        setActive(false);
      };
      r.onend = () => setActive(false);
      recogRef.current = r;
    }
  }, [router]);

  function toggle() {
    if (!recogRef.current) {
      alert("আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই।");
      return;
    }
    if (active) {
      recogRef.current.stop();
      setActive(false);
    } else {
      setActive(true);
      recogRef.current.start();
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Voice assistant"
      className="fixed bottom-6 right-6 rounded-full shadow-lg border bg-white w-14 h-14 flex items-center justify-center text-2xl"
      title="বলুন: আবহাওয়া, বাজারদর, শিখুন…"
    >
      {active ? "🎙️" : "🎤"}
    </button>
  );
}
