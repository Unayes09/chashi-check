"use client";

import { useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

/** কিউরেটেড ভিডিও তালিকা (ভিডিও আইডি + শিরোনাম + চ্যানেল + ইউআরএল) */
type VideoItem = { id: string; title: string; channel: string; url: string };
type Section = { key: string; label: string; items: VideoItem[] };

const VIDEOS: Section[] = [
  {
    key: "rice",
    label: "ধান",
    items: [
      { id: "zwYEXpkjw20", title: "ধাপে ধাপে ধান চাষের সম্পূর্ণ নির্দেশিকা", channel: "অ্যাগ্রি টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=zwYEXpkjw20" },
      { id: "UZbcg8hHMFM", title: "এসআরআই পদ্ধতিতে ধান চাষ—কম খরচে বেশি ফলন", channel: "অ্যাগ্রি টিপস", url: "https://www.youtube.com/watch?v=UZbcg8hHMFM" },
      { id: "ZK-B4yWHp0o", title: "সমলয় পদ্ধতিতে সময়মতো ধান রোপণ", channel: "মিত্তিকা টিভি", url: "https://www.youtube.com/watch?v=ZK-B4yWHp0o" },
      { id: "Ac2zcNsZaao", title: "জলবায়ু-সহনশীল ধানের জাতসমূহ", channel: "বিআরআরআই", url: "https://www.youtube.com/watch?v=Ac2zcNsZaao" },
      { id: "SPCH3PpWaMM", title: "লবণাক্ততা-সহনশীল ধান: মাঠের অভিজ্ঞতা", channel: "আইআরআরআই", url: "https://www.youtube.com/watch?v=SPCH3PpWaMM" },
      { id: "Itgu31ncOUM", title: "বন্যা-সহনশীল ধান—কৃষকের বাস্তব গল্প", channel: "আইআরআরআই", url: "https://www.youtube.com/watch?v=Itgu31ncOUM" },
    ],
  },
  {
    key: "veg",
    label: "সবজি",
    items: [
      { id: "s62aLw4SjE0", title: "সবজির রোগ-বালাই ও সমাধান (পর্ব)", channel: "দীপ্তো কৃষি", url: "https://www.youtube.com/watch?v=s62aLw4SjE0" },
      { id: "PaGLjnxAq9I", title: "সবজির ভাইরাস রোগ দমনের সহজ কৌশল", channel: "অ্যাগ্রি টিপস", url: "https://www.youtube.com/watch?v=PaGLjnxAq9I" },
      { id: "GgVyM5ByYsQ", title: "গ্রীষ্মকালীন সবজির পোকা-মাকড় ও দমন", channel: "অ্যাগ্রি গাইড", url: "https://www.youtube.com/watch?v=GgVyM5ByYsQ" },
      { id: "IoJI10OCpr0", title: "সবজি বাগানের রোগ-পোকা চেনা ও নিয়ন্ত্রণ", channel: "ভিলেজ অ্যাগ্রো বিডি", url: "https://www.youtube.com/watch?v=IoJI10OCpr0" },
      { id: "P7YauymJNIQ", title: "কোন পোকা লাগলে কোন ওষুধ—চেনার নিয়ম", channel: "ছাদ কৃষি", url: "https://www.youtube.com/watch?v=P7YauymJNIQ" },
    ],
  },
  {
    key: "fert_irri",
    label: "সার/সেচ",
    items: [
      { id: "N1hzYDwvnx0", title: "ধান রোপণের ২০–২৫ দিন: সার ব্যবস্থাপনা", channel: "চাষবাস", url: "https://www.youtube.com/watch?v=N1hzYDwvnx0" },
      { id: "2FE4eIkEBS4", title: "পানি সংকটে সেচ ব্যবস্থার কার্যকর সমাধান", channel: "পার্টনার্স", url: "https://www.youtube.com/watch?v=2FE4eIkEBS4" },
      { id: "80jCpdL6s84", title: "নতুন কৃষি প্রযুক্তি ও উঁচু-বিছানা পদ্ধতি", channel: "অ্যাগ্রি নিউ টেক", url: "https://www.youtube.com/watch?v=80jCpdL6s84" },
    ],
  },
  {
    key: "pest",
    label: "রোগ/কীট",
    items: [
      { id: "BwwIg_zwBug", title: "সবজির রোগ-পোকা নিয়ন্ত্রণ—ধাপে ধাপে", channel: "অ্যাগ্রি ক্লিনিক", url: "https://www.youtube.com/watch?v=BwwIg_zwBug" },
      { id: "_7ygEfvBBY4", title: "জলাবদ্ধতা সহনশীল ধান—চারা বাঁচানোর কৌশল", channel: "আইআরআরআই", url: "https://www.youtube.com/watch?v=_7ygEfvBBY4" },
      { id: "0WTuDMrmK28", title: "ধান চাষে ফলন বাড়ানোর ১০টি টিপস", channel: "অ্যাগ্রি টিপস", url: "https://www.youtube.com/watch?v=0WTuDMrmK28" },
    ],
  },
  {
    key: "fish",
    label: "মাছ চাষ",
    items: [
      { id: "F3SarS10dc8", title: "পুকুর প্রস্তুতি—চুন, সার ও পানি নিয়ন্ত্রণ", channel: "প্রশিক্ষণ", url: "https://www.youtube.com/watch?v=F3SarS10dc8" },
      { id: "YdEtt0yuCI8", title: "পুকুর সবুজকরণ ও খাদ্য ব্যবস্থাপনা", channel: "ফিশারিজ বিডি", url: "https://www.youtube.com/watch?v=YdEtt0yuCI8" },
      { id: "tsPO6ZhtioU", title: "কার্পজাতীয় মাছের মিশ্র চাষ—সম্পূর্ণ গাইড", channel: "শাকিব অ্যাগ্রো", url: "https://www.youtube.com/watch?v=tsPO6ZhtioU" },
      { id: "p4RZ4gLOEp0", title: "মাছ চাষে লাভ বাড়ানোর বাস্তব কৌশল", channel: "কৃষি ও প্রযুক্তি", url: "https://www.youtube.com/watch?v=p4RZ4gLOEp0" },
    ],
  },
  {
    key: "poultry",
    label: "পোল্ট্রি/পশুপালন",
    items: [
      { id: "YD7HuTTh66g", title: "মুরগি পালন—শুরু থেকে পুরো কোর্স", channel: "আজিম অ্যাগ্রো বিডি", url: "https://www.youtube.com/watch?v=YD7HuTTh66g" },
      { id: "D1iKauYKgL4", title: "ব্রয়লার ব্রুডিং ও রোগমুক্ত রাখার নিয়ম", channel: "পোল্ট্রি কেয়ার", url: "https://www.youtube.com/watch?v=D1iKauYKgL4" },
      { id: "PxiFUfC1D24", title: "লেয়ার ব্যবস্থাপনা—খাদ্য, আলো ও স্বাস্থ্য", channel: "বিএলআরআই", url: "https://www.youtube.com/watch?v=PxiFUfC1D24" },
      { id: "iWTWmGf_WNU", title: "নিরাপদ পোল্ট্রি উৎপাদন—ভাল চর্চা", channel: "সবুজ বাংলা", url: "https://www.youtube.com/watch?v=iWTWmGf_WNU" },
    ],
  },
  {
    key: "flood",
    label: "বন্যা/জরুরি",
    items: [
      { id: "Wz7Qa_rZmwY", title: "বন্যা পরবর্তী কৃষিক্ষেত্রে করণীয়", channel: "দীপ্তো কৃষি", url: "https://www.youtube.com/watch?v=Wz7Qa_rZmwY" },
      { id: "2iLRlg9AHM0", title: "বন্যার পর কোন চাষ লাভজনক", channel: "ডিবিসি কৃষিকথা", url: "https://www.youtube.com/watch?v=2iLRlg9AHM0" },
      { id: "vY8AHL63qpQ", title: "আকস্মিক বন্যায় ফসল রক্ষার সতর্কতা", channel: "চ্যানেল ২৪", url: "https://www.youtube.com/watch?v=vY8AHL63qpQ" },
      { id: "Ir8ZnpZf83I", title: "বন্যা-সহনশীল ধান—কৃষকের গল্প", channel: "আইআরআরআই", url: "https://www.youtube.com/watch?v=Ir8ZnpZf83I" },
      { id: "c5MKlSoubOY", title: "ভাসমান কৃষি—বন্যায় টিকে থাকার কৌশল", channel: "ফিচার প্রতিবেদন", url: "https://www.youtube.com/watch?v=c5MKlSoubOY" },
      { id: "6VtMrFGP-K4", title: "ঘূর্ণিঝড়ে ক্ষতিগ্রস্ত খামার পুনর্গঠন", channel: "এফএও", url: "https://www.youtube.com/watch?v=6VtMrFGP-K4" },
    ],
  },
  {
    key: "post",
    label: "ফসল-পরবর্তী/বীজ",
    items: [
      { id: "L1uzNWo-J5Q", title: "ধানবীজ সুরক্ষিতভাবে সংরক্ষণ (কোকুন পদ্ধতি)", channel: "আইআরআরআই", url: "https://www.youtube.com/watch?v=L1uzNWo-J5Q" },
      { id: "oaJz-7Psnj0", title: "নিজের ধান থেকে মানসম্মত বীজ তৈরির পদ্ধতি", channel: "আরএ অফিসিয়াল অ্যাগ্রি টিপস", url: "https://www.youtube.com/watch?v=oaJz-7Psnj0" },
      { id: "RJtuNCJ7zkc", title: "বীজ সংরক্ষণ—কোন ধান বেছে নেবেন", channel: "কৃষি জানালা সিডস", url: "https://www.youtube.com/watch?v=RJtuNCJ7zkc" },
    ],
  },
];

/** ছোট ভিডিও কার্ড (থাম্বনেইল → মডাল প্লেয়ার) */
function VideoCard({ v }: { v: VideoItem }) {
  const [open, setOpen] = useState(false);
  const thumb = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group w-full text-left rounded-xl border bg-white hover:shadow-md transition overflow-hidden"
        aria-label={`ভিডিও চালান: ${v.title}`}
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt={v.title} className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/55 rounded-full px-3 py-1.5 text-white text-xs group-hover:bg-black/65">▶️ চালান</div>
          </div>
        </div>
        <div className="p-3">
          <div className="font-semibold line-clamp-2">{v.title}</div>
          <div className="text-xs text-gray-500 mt-1">{v.channel}</div>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-3 bg-white flex items-center justify-between">
              <div className="font-semibold text-sm line-clamp-2">{v.title}</div>
              <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-1 text-sm border hover:bg-gray-50">বন্ধ করুন</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ShikhaPage() {
  const [active, setActive] = useState<string>("rice");
  const [q, setQ] = useState<string>("");

  const current = useMemo(
    () => VIDEOS.find(s => s.key === active) ?? VIDEOS[0],
    [active]
  );
  const filtered = useMemo(() => {
    if (!q.trim()) return current.items;
    const needle = q.trim().toLowerCase();
    return current.items.filter(v =>
      v.title.toLowerCase().includes(needle) || v.channel.toLowerCase().includes(needle)
    );
  }, [q, current]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <section>
          <h1 className="text-2xl font-semibold">ভিডিও দিয়ে শেখা</h1>
          <p className="text-gray-600">ধান, সবজি, সার/সেচ, রোগ/কীট, মাছ/পোল্ট্রি, বন্যা/জরুরি, বীজ সংরক্ষণ—সব এক জায়গায়।</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {VIDEOS.map(s => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${active === s.key ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50"}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="যেমন: বন্যা পরবর্তী পরিচর্যা / ভাইরাস রোগ / পুকুর প্রস্তুতি"
              className="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(v => <VideoCard key={v.id} v={v} />)}
          </div>

          {filtered.length === 0 && (
            <div className="mt-6 text-sm text-gray-600">কোনো ভিডিও পাওয়া যায়নি—খোঁজার শব্দ বদলে দেখুন।</div>
          )}

          <p className="mt-6 text-xs text-gray-500">সতর্কতা: ভিডিওগুলো তাদের নিজ নিজ চ্যানেলের। মাঠে প্রয়োগের আগে স্থানীয় কৃষি কর্মকর্তার পরামর্শ নিন।</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
