import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const outlineGeist = Geist({
  subsets: ["latin"],
  variable: "--font-outline-geist",
});

const monoGeist = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-geist",
});

export const metadata: Metadata = {
  title: "Environment Variables Editor",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" className={`${inter.variable} ${outlineGeist.variable} ${monoGeist.variable}`}
    >
      <body className="flex flex-col font-inter tracking-tight">
        {children}
      </body>
    </html>
  );
}
