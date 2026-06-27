import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CEO Clubhouse — News für Entscheider",
  description:
    "KI-zusammengefasste Nachrichten aus Tech, Business und Trends. Täglich. Kostenlos.",
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
      </body>
    </html>
  );
}
