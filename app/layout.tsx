import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Rithma",
  description: "Tu música, todas las plataformas. Un solo lugar.",
  openGraph: {
    title: "Rithma",
    description: "Tu música, todas las plataformas. Un solo lugar.",
    type: "website",
    siteName: "Rithma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rithma",
    description: "Tu música, todas las plataformas. Un solo lugar.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${bricolage.variable} ${instrument.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-[100dvh] flex flex-col bg-[#0C0C0F] text-[#F2F0EA] antialiased">
        <Nav />
        <main className="flex flex-col flex-1">{children}</main>
      </body>
    </html>
  );
}
