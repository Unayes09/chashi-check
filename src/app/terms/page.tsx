export default function TermsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Terms and Conditions</h1>
      <p className="text-gray-600">
        By using ChashiBondhu, you agree to the following terms and conditions:
      </p>
      <ul className="mt-4 space-y-2">
        <li>All content is provided for informational purposes only.</li>
        <li>We are not liable for any damages resulting from the use of this platform.</li>
        <li>For questions, contact us at <a href="mailto:chashibondhu@gmail.com" className="text-blue-600 hover:underline">chashibondhu@gmail.com</a>.</li>
      </ul>
    </main>
  );
}