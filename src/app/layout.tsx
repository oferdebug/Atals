import type { Metadata } from "next";
import { Inter, Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atals — Precision Curator",
  description: "AI-curated roles for editorial professionals.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html
          lang="en"
          className={cn(inter.variable, instrumentSerif.variable, manrope.variable, "font-mono", jetbrainsMono.variable)}
      >
      <body className={'bg-primary text-white'}>{children}</body>
      </html>
  );
}