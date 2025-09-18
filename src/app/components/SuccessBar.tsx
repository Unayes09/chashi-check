export default function SuccessBar({ pct }: { pct: number }) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div className="w-full">
      <div className="text-xs text-gray-600 mb-1">অগ্রগতি: {p}%</div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500" style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}
