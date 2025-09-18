import Image from "next/image";

export default function AboutStrip() {
  return (
    <section className="mt-16 grid gap-8 md:grid-cols-2 items-center">
      {/* Left: Farmer image */}
      <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden">
        <Image
          src="/farmer-smiling.png" // put an image in /public/farmer-smile.jpg
          alt="Farmer smiling with crop"
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Knowledge / About text */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">চাষীবন্ধু কী?</h2>
        <p className="text-gray-700">
          চাষীবন্ধু একটি ভয়েস-ফার্স্ট কৃষি সহায়ক, যেখানে কৃষকরা সহজে প্রশ্ন করতে পারে
          এবং উত্তর পেতে পারে নিজের ভাষায়।
        </p>
        <p className="text-gray-700">
          আবহাওয়ার খবর, বাজারদর, ফসলের রোগ শনাক্তকরণ, সেচ ও সার ব্যবস্থাপনা—
          সব এক জায়গায়।
        </p>
        <p className="text-gray-700">
          আমাদের লক্ষ্য হলো কৃষকদের আরও স্বনির্ভর করা এবং আধুনিক কৃষি জ্ঞান
          সহজে পৌঁছে দেওয়া।
        </p>
        <p className="text-gray-700">
          ভয়েস-ভিত্তিক ব্যবহার মানে লেখাপড়া না জানলেও ব্যবহার করা যায়।
        </p>
        <p className="text-gray-700">
          চাষীবন্ধু কেবল একটি অ্যাপ নয় — এটি কৃষকদের জন্য একটি বিশ্বাসযোগ্য বন্ধু।
        </p>
      </div>
    </section>
  );
}
