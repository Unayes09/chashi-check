"use client";

import { useMemo } from "react";
import type { CropPlan } from "@/app/utils/api";
import SuccessBar from "./SuccessBar";

export default function CropTimeline({
  plan,
  onToggle,
  onAskAi,
}: {
  plan: CropPlan;
  onToggle: (itemId: string, done: boolean) => void;
  onAskAi: (itemId: string) => void;
}) {
  const doneCount = useMemo(() => plan.timeline.filter(t => t.done).length, [plan.timeline]);
  const pct = (doneCount / plan.timeline.length) * 100;

  return (
    <div className="space-y-4">
      <SuccessBar pct={pct} />
      <ul className="space-y-3">
        {plan.timeline.map(t => (
          <li key={t.id} className="rounded-xl border p-4 bg-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-gray-500">{t.date}</div>
                <div className="font-semibold">{t.title}</div>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{t.adviceTxt}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => onAskAi(t.id)}
                  className="text-xs px-3 py-1 rounded-full border hover:bg-gray-50"
                >
                  🤖 AI পরামর্শ
                </button>
                <label className="text-xs inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!!t.done}
                    onChange={(e) => onToggle(t.id, e.target.checked)}
                  />
                  সম্পন্ন
                </label>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
