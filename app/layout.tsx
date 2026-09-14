import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christiansebastian.com";
const SITE_DESCRIPTION =
  "Fotógrafo profesional en Buenos Aires. 15 años, cumpleaños, eventos y retratos. Historias que merecen ser recordadas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Christian Sebastián — Fotógrafo",
    template: "%s — Christian Sebastián",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Christian Sebastián",
    title: "Christian Sebastián — Fotógrafo",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Sebastián — Fotógrafo",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
