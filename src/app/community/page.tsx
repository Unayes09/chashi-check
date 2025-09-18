import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-semibold">কৃষক প্রশ্নোত্তর</h1>
        <p className="text-gray-600 mt-2">ভয়েসে প্রশ্ন করুন, ভয়েসে উত্তর শুনুন।</p>
        {/* TODO: Voice Q&A list + recorder */}
      </main>
      <Footer />
    </>
  );
}
