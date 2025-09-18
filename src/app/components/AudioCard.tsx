"use client";
import { useState } from "react";
import type { Lesson } from "@/app/utils/api";

export default function AudioCard({ lesson }: { lesson: Lesson }) {
  const [speaking, setSpeaking] = useState(false);

  function speak() {
    try {
      const s = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(lesson.transcript);
      u.lang = "bn-BD";
      u.onend = () => setSpeaking(false);
      setSpeaking(true);
      s.speak(u);
    } catch {}
  }

  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{lesson.title}</div>
        <div className="text-xs text-gray-500">{Math.round(lesson.durationSec/60)} মিনিট</div>
      </div>
      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{lesson.transcript}</p>
      <div className="mt-2">
        <button onClick={speak} className="text-xs px-3 py-1 rounded-full border hover:bg-gray-50">
          {speaking ? "🔊 চলছে…" : "🔊 শুনুন"}
        </button>
      </div>
    </div>
  );
}
