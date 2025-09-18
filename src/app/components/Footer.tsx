export default function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold">চাষীবন্ধু</div>
          <p className="text-sm text-gray-600 mt-2">
            কৃষকের কথা, কৃষকের পাশে — voice-first কৃষি সহায়ক।
          </p>
        </div>
        <div>
          <div className="font-semibold">Quick Links</div>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li><a href="/help" className="hover:underline">Help</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy</a></li>
            <li><a href="/terms" className="hover:underline">Terms</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <p className="text-sm text-gray-600 mt-2">
            হেল্পলাইন: ০১২৩৪৫৬৭৮৯<br />
            ইমেইল: hello@chashibondhu.example
          </p>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} ChashiBondhu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
