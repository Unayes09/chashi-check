"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LS_KEYS } from "../utils/api";

const navItems = [
  { href: "/", label: "হোম" },
  { href: "/market", label: "বাজার" },
  { href: "/learn", label: "শিখা" },
  { href: "/amar-foshol", label: "আমার ফসল" },
  { href: "/emergency", label: "জরুরি সহায়তা" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check for token and phone in localStorage
    const storedToken = localStorage.getItem(LS_KEYS.JWT);
    const storedPhone = localStorage.getItem(LS_KEYS.PHONE);
    setToken(storedToken);
    setPhone(storedPhone);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(LS_KEYS.JWT);
    localStorage.removeItem(LS_KEYS.PHONE);
    setToken(null);
    setPhone(null);
    // Optionally redirect to home page
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-bold text-lg">চাষীবন্ধু</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm ${pathname === n.href ? "font-semibold" : "text-gray-600 hover:text-gray-900"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{phone}</span>
              <button
                onClick={handleLogout}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                aria-label="লগআউট"
                title="লগআউট"
              >
                🚪
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium border hover:bg-gray-50"
              aria-label="লগইন"
            >
              লগইন
            </Link>
          )}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile */}
      {open && (
        <div className="md:hidden border-t">
          <nav className="px-4 py-3 flex flex-col gap-3">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-gray-700"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
