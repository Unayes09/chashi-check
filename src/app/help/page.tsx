export default function HelpPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Help</h1>
      <p className="text-gray-600">
        Welcome to the Help page! If you have any questions or need assistance, please contact us at:
      </p>
      <ul className="mt-4 space-y-2">
        <li>Email: <a href="mailto:chashibondhu@gmail.com" className="text-blue-600 hover:underline">chashibondhu@gmail.com</a></li>
        <li>Phone: +880-1234-567890</li>
      </ul>
    </main>
  );
}