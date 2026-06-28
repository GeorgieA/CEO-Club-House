import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import { defaultOgImage, getOgImageUrl } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "CEO Clubhouse — News für Entscheider",
  description:
    "KI-zusammengefasste Nachrichten aus Tech, Business und Trends. Täglich. Kostenlos.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "CEO Clubhouse",
    title: "CEO Clubhouse — News für Entscheider",
    description:
      "KI-zusammengefasste Nachrichten aus Tech, Business und Trends. Täglich. Kostenlos.",
    images: [{ ...defaultOgImage, url: getOgImageUrl() }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CEO Clubhouse — News für Entscheider",
    description:
      "KI-zusammengefasste Nachrichten aus Tech, Business und Trends. Täglich. Kostenlos.",
    images: [getOgImageUrl()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`}
        </Script>
      </head>
      <body className={`${plusJakarta.variable} min-h-screen antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
