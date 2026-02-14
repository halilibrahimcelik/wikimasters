import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/features/navbar";
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WikiMasters",
  description:
    "A knowledge sharing platform built with Next.js, Prisma, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} antialiased`}>
      <body><StackProvider app={stackClientApp}><StackTheme>
        <Navbar />
        {children}
      </StackTheme></StackProvider></body>
    </html>
  );
}
