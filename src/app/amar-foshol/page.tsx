"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { listCrops, type CropPlan } from "@/app/utils/api";
import { convertToBengaliNumerals } from "@/app/utils/convertToBengali";

export default function AmarFosholPage() {
  const [crops, setCrops] = useState<CropPlan[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listCrops();
        setCrops(data);
      } catch {
        setCrops(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <section>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">আমার ফসল</h1>
            <Link href="/learn/new" className="rounded-full px-4 py-2 text-sm border hover:bg-gray-50">
              ➕ নতুন ফসল যোগ করুন
            </Link>
          </div>
          <p className="text-gray-600 mt-1">এখানে আপনার ফসলের সময়সূচি, কাজের তালিকা, এলাকা ও জেলার তথ্য রাখা যাবে।</p>

          <div className="mt-8">
            <div className="font-semibold mb-2">তালিকা</div>

            {loading ? (
              <div className="text-sm text-gray-600">লোড হচ্ছে…</div>
            ) : !crops || crops.length === 0 ? (
              <div className="text-sm text-gray-600">
                এখনও কোনো ফসল যোগ করা হয়নি। উপরের বোতাম থেকে শুরু করুন।
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {crops.map((c) => (
                  <Link
                    key={c.id}
                    href={`/learn/${c.id}`}
                    className="rounded-xl border p-4 bg-white hover:bg-emerald-50 transition-colors"
                  >
                    <div className="text-xs text-gray-500">{c.startedAt}</div>
                    <div className="font-semibold">
                      {c.cropName} {c.jat && `(${c.jat})`}
                    </div>
                    {c.area && <div className="text-sm text-gray-600">এলাকা: {convertToBengaliNumerals(c.area)}</div>}
                    {c.district && <div className="text-sm text-gray-600">জেলা: {c.district}</div>}
                    <div className="text-xs text-emerald-600 mt-2">
                      {convertToBengaliNumerals(c.timeline?.length)} টি কাজ
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
