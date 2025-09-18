import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import VoiceFab from "@/app/components/VoiceFab";
import AboutStrip from "./components/AboutStrip";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4">
        <div className="py-8">
          <Hero />
        </div>

        <div className="py-8">
          <AboutStrip />
        </div>

        {/* What we do */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: "Abhawa & Advisory", desc: "আজ/আগামীকালের আবহাওয়া শুনুন ও করণীয় জানুন।", icon: "🌦️" },
            { title: "Bazardor & Analysis", desc: "সবজি, ধান, ডিম-মাংসের দর—জেলাভিত্তিক তথ্য।", icon: "💰" },
            { title: "Shikhun (Audio)", desc: "ফসলের রোগ প্রতিকার, সেচ, সার—সহজ অডিও গাইড।", icon: "🎧" },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border p-5 bg-white">
              <div className="text-3xl">{c.icon}</div>
              <div className="mt-2 font-semibold">{c.title}</div>
              <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
              <Link href={(c.title.includes("Abhawa") && "/weather") || (c.title.includes("Bazardor") && "/market") || "/learn"} className="text-sm text-green-700 hover:underline mt-3 inline-block">
                বিস্তারিত →
              </Link>
            </div>
          ))}
        </section>

        {/* Market analysis strip */}
        <section aria-label="Market Analysis" className="mt-12 rounded-2xl border p-5 bg-emerald-50">
          <div className="font-semibold mb-3">আজকের বাজারদর (ঝটপট)</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* These mirror the API; keep in sync */}
            <Ticker name="পটল" price="৳48/kg" trend="↑ 3%" />
            <Ticker name="বেগুন" price="৳60/kg" trend="↓ 2%" />
            <Ticker name="চাল (মাঝারি)" price="৳56/kg" trend="—" />
            <Ticker name="ব্রয়লার মুরগি" price="৳180/kg" trend="↑ 1%" />
          </div>
          <Link href="/market" className="text-sm text-green-700 hover:underline mt-3 inline-block">পূর্ণ তালিকা দেখুন →</Link>
        </section>

        {/* Our goals */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "ডিজিটাল অন্তর্ভুক্তি", text: "নিরক্ষর/কম-সাক্ষর কৃষকের জন্য ভয়েস-ফার্স্ট সেবা।" },
            { title: "স্মার্ট কৃষিকাজ", text: "আবহাওয়া-ভিত্তিক পরামর্শ ও খরচ বাঁচানো।" },
            { title: "কৃষক স্বনির্ভরতা", text: "পিয়ার-টু-পিয়ার বাজারে মধ্যস্বত্বভোগীর ভূমিকা কমানো।" },
          ].map((g) => (
            <div key={g.title} className="rounded-2xl border p-5 bg-white">
              <div className="font-semibold">{g.title}</div>
              <p className="text-sm text-gray-600 mt-1">{g.text}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}

function Ticker({ name, price, trend }: { name: string; price: string; trend: string }) {
  return (
    <div className="rounded-xl bg-white border p-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-600">{name}</div>
        <div className="font-semibold">{price}</div>
      </div>
      <div className="text-xs text-gray-600">{trend}</div>
    </div>
  );
}