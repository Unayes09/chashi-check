/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import VoiceField from "@/app/components/VoiceField";
import { createCropPlan } from "@/app/utils/api";

export default function NewCropPage() {
  const [cropName, setCropName] = useState("");
  const router = useRouter();
  const [jat, setJat] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!cropName || !jat) {
      setErr("ফসলের নাম ও জাত দিন।");
      return;
    }
    setLoading(true);
    try {
      const created = await createCropPlan({ cropName, jat, district, area });
      router.push(`/learn/${created.id}`); // TODO: remove this
    } catch (e: any) {
      setErr(e.message || "যোগ করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">নতুন ফসল যোগ করুন</h1>
        <p className="text-gray-600 mt-2">ভয়েসে বা হাতে টাইপ করে তথ্য দিন।</p>

        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6">
          <VoiceField label="ফসলের নাম" placeholder="উদাহরণ: ধান" value={cropName} onChange={setCropName} extractAfter="নাম" />
          <VoiceField label="জাত" placeholder="উদাহরণ: ব্রি-২৮" value={jat} onChange={setJat} extractAfter="জাত" />
          <VoiceField label="জেলা" placeholder="উদাহরণ: সিলেট" value={district} onChange={setDistrict} extractAfter="জেলা" />
          <VoiceField label="এলাকা/জমির পরিমাণ" placeholder="উদাহরণ: ৩ বিঘা" value={area} onChange={setArea} />

          {err && <div className="text-sm text-red-600">{err}</div>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ করুন"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
