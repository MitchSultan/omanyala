import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { LoaderGate } from "@/components/loader/LoaderGate";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
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

const loaderInitScript = `
(function(){
  try {
    var t = localStorage.getItem('omanyala:theme');
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
    var force = window.location.search.indexOf('loader=1') !== -1;
    var loaded = sessionStorage.getItem('omanyala:loaded') === '1';
    if (force || !loaded) {
      document.documentElement.classList.add('is-loading');
    } else {
      document.documentElement.dataset.loaded = 'true';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderInitScript }} />
        <noscript>
          <style>{`html.is-loading main { opacity: 1 !important; visibility: visible !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Suspense fallback={null}>
          <LoaderGate />
        </Suspense>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
