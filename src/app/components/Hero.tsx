"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { convertToBengaliNumerals } from "@/app/utils/convertToBengali";

type Weather = {
  date: string;
  location: string;
  summary: string;
  tempC: string;
  rainChancePct: string;
};

// ডামি আবহাওয়া ডেটা
const dummyWeather: Weather = {
  date: "২০২৫-০৯-১৯",
  location: "সিলেট, বাংলাদেশ",
  summary: "আংশিক মেঘলা, হালকা বৃষ্টির সম্ভাবনা",
  tempC: "৩২",
  rainChancePct: "৬৫"
};

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    // ১.৫ সেকেন্ড পর ডেটা লোড হবে
    const timer = setTimeout(() => {
      setWeather(dummyWeather);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border">
      {/* Helpful hero image (replace with /public/field.jpg later) */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-gradient-to-r from-green-100 to-emerald-50" />
        {/* Example decorative emoji pattern */}
        <div className="absolute -right-10 -top-8 text-8xl opacity-10">🌾</div>
        <div className="absolute -left-8 bottom-0 text-8xl opacity-10">🚜</div>
      </div>

      <div className="relative px-6 py-12 md:px-12 md:py-16 grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            চাষীবন্ধু — সহজ কথায় কৃষি সহায়ক
          </h1>
          <p className="text-gray-700">
            আবহাওয়া, বাজারদর, রোগ শনাক্তকরণ ও শেখা—সব এক জায়গায়।
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#ask" className="rounded-full px-5 py-3 text-sm font-medium bg-green-600 text-white hover:bg-green-700">
              প্রশ্ন করুন
            </Link>
            <Link href="/market" className="rounded-full px-5 py-3 text-sm font-medium border hover:bg-white">
              আজকের বাজারদর
            </Link>
          </div>
        </div>

        {/* Right: Today snapshot cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white border p-4">
            <div className="text-sm text-gray-500">আজকের আবহাওয়া</div>
            {loading ? (
              <div className="mt-2 text-sm">লোড হচ্ছে…</div>
            ) : weather ? (
              <div className="mt-2">
                <div className="text-lg font-semibold">{weather.location}</div>
                <div className="text-sm text-gray-700">{weather.summary}</div>
                <div className="mt-2 text-2xl font-bold">{weather.tempC}°C</div>
                <div className="text-xs text-gray-600">বৃষ্টির সম্ভাবনা: {weather.rainChancePct}%</div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-red-600">ডাটা পাওয়া যায়নি</div>
            )}
          </div>

          <div className="rounded-2xl bg-white border p-4">
            <div className="text-sm text-gray-500">আজকের বাজার বিশ্লেষণ</div>
            <MarketMini />
          </div>
        </div>
      </div>
    </section>
  );
}

// ডামি বাজার ডেটা
const dummyData = {
  items: [
    { name: "পটল", unit: "কেজি", price: 48 },
    { name: "বেগুন", unit: "কেজি", price: 60 },
    { name: "চাল (মাঝারি)", unit: "কেজি", price: 56 },
    { name: "ব্রয়লার মুরগি", unit: "কেজি", price: 180 },
    { name: "টমেটো", unit: "কেজি", price: 85 },
    { name: "কাঁচা মরিচ", unit: "কেজি", price: 120 }
  ]
};

function MarketMini() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ items: { name: string; unit: string; price: number }[] } | null>(null);

  useEffect(() => {
    // ১.৫ সেকেন্ড পর ডেটা লোড হবে
    const timer = setTimeout(() => {
      setData(dummyData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="mt-2 text-sm">লোড হচ্ছে…</div>;
  if (!data) return <div className="mt-2 text-sm text-red-600">ডাটা পাওয়া যায়নি</div>;

  return (
    <ul className="mt-2 space-y-1">
      {data.items.slice(0, 4).map((it) => (
        <li key={it.name} className="text-sm flex items-center justify-between">
          <span className="text-gray-700">{it.name} <span className="text-xs text-gray-500">/ {it.unit}</span></span>
          <span className="font-medium">৳{convertToBengaliNumerals(it.price)}</span>
        </li>
      ))}
      <Link href="/market" className="text-xs text-green-700 hover:underline mt-2 inline-block">আরো দেখুন →</Link>
    </ul>
  );
}
