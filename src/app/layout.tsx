import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VoiceFab from "./components/VoiceFab";
import VoiceChatFab from "./components/VoiceChatFab";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "চাষীবন্ধু | ChashiBondhu",
  description: "ভয়েস-ফার্স্ট কৃষি সহায়ক — আবহাওয়া, বাজারদর, ফসলের যত্ন ও শেখার অডিও।",
  icons: {
    icon: "/favicon.png", // place your favicon in /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://code.responsivevoice.org/responsivevoice.js?key=jqTA2gMi"
          async
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <VoiceFab />
        <VoiceChatFab />
      </body>
    </html>
  );
}
