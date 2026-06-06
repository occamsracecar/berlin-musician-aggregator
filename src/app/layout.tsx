import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { getSiteOrigin } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: "Berlin Musician Listings",
    template: "%s | Berlin Musician Listings",
  },
  description:
    "Find musicians or join a band in Berlin. Search listings from Noisy Rooms, Backstage PRO, Berlin Musiker and more.",
  openGraph: {
    type: "website",
    locale: "en_DE",
    siteName: "Berlin Musician Listings",
    title: "Berlin Musician Listings",
    description:
      "Find musicians or join a band in Berlin. Search aggregated listings from local musician boards.",
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="flex min-h-full flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
