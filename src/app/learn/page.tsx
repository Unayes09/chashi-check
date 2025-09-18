"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AudioCard from "@/app/components/AudioCard";
import Link from "next/link";
import { getGeneralLessons, listCrops, type Lesson, type CropPlan } from "@/app/utils/api";

export default function LearnPage() {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [crops, setCrops] = useState<CropPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [lessonsData, cropsData] = await Promise.all([
          getGeneralLessons(),
          listCrops()
        ]);
        setLessons(lessonsData);
        setCrops(cropsData);
      } catch (err) {
        setError("ডেটা লোড করতে সমস্যা হয়েছে");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">শেখার অডিও গাইড</h1>
          <Link href="/learn/new" className="rounded-full px-4 py-2 text-sm border hover:bg-gray-50">
            ➕ নতুন ফসল যোগ করুন
          </Link>
        </div>
        <p className="text-gray-600 mt-2">
          জেলা অনুসারে ফসলের যত্ন, রোগ প্রতিকার, সার ও সেচ সংক্রান্ত অডিও লেসন।
        </p>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* General audio lessons */}
        <section className="mt-6">
          <div className="font-semibold mb-2">সব ফসলের জন্য দরকারি</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(lessons ?? []).map((l) => <AudioCard key={l.id} lesson={l} />)}
          </div>
        </section>

        {/* User crops */}
        <section className="mt-10">
          <div className="font-semibold mb-2">আমার ফসল</div>
          {(!crops || crops.length === 0) ? (
            <div className="text-sm text-gray-600">এখনও কোনো ফসল যোগ করা হয়নি।</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {crops!.map((c) => (
                <Link key={c.id} href={`/learn/${c.id}`} className="rounded-xl border p-4 bg-white hover:bg-emerald-50 transition-colors">
                  <div className="text-xs text-gray-500">{c.startedAt}</div>
                  <div className="font-semibold">{c.cropName} {c.jat && `(${c.jat})`}</div>
                  {c.area && <div className="text-sm text-gray-600">এলাকা: {c.area}</div>}
                  {c.district && <div className="text-sm text-gray-600">জেলা: {c.district}</div>}
                  <div className="text-xs text-emerald-600 mt-2">
                    {c.timeline?.length || 0} টি কাজ
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}