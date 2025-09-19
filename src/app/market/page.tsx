import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { convertToBengaliNumerals } from "@/app/utils/convertToBengali";
import { getMarketSnapshot, type MarketCategory } from "@/app/utils/api";

export const metadata = {
  title: "আজকের বাজারদর | চাষীবন্ধু",
};

export default async function MarketPage() {
  // You can pass a district later: getMarketSnapshot("Sylhet")
  const snap = await getMarketSnapshot();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">আজকের বাজারদর</h1>
          <div className="text-sm text-gray-500">
            তারিখ: {snap.date}{snap.district ? ` · জেলা: ${snap.district}` : ""}
          </div>
        </div>

        {/* Category sections */}
        <div className="mt-6 space-y-10">
          {snap.categories.map((cat) => (
            <CategorySection key={cat.key} cat={cat} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function CategorySection({ cat }: { cat: MarketCategory }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className="text-xl">{cat.emoji ?? "🛒"}</div>
        <h2 className="text-lg font-semibold">{cat.title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cat.items.map((it) => (
          <div key={it.name} className="rounded-xl border p-4 bg-white flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-700">{it.name}</div>
              <div className="text-xs text-gray-500">/ {it.unit}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">৳{convertToBengaliNumerals(it.price)}</div>
              {typeof it.changePct === "number" && (
                <div className={`text-xs ${it.changePct > 0 ? "text-red-600" : it.changePct < 0 ? "text-emerald-600" : "text-gray-500"}`}>
                  {it.changePct === 0 ? "—" : `${it.changePct > 0 ? "↑" : "↓"} ${Math.abs(it.changePct)}%`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
