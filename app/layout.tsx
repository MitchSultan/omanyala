import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ferdinand Omanyala — Africa's Fastest Man",
  description:
    "Official portfolio of Ferdinand Omanyala — African 100m record holder (9.77s), reigning Commonwealth Games champion, and Kenya's sprint icon.",
  keywords: [
    "Ferdinand Omanyala",
    "Africa fastest man",
    "100m sprint",
    "Kenya athletics",
    "Commonwealth Games",
  ],
  openGraph: {
    title: "Ferdinand Omanyala — Africa's Fastest Man",
    description:
      "African 100m record holder (9.77s) and reigning Commonwealth Games champion.",
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0]">
        {children}
      </body>
    </html>
  );
}
