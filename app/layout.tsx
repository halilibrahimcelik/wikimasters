import { StackProvider, StackTheme } from "@stackframe/stack";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { stackClientApp } from "../stack/client";
import "./globals.css";
import { Navbar } from "@/components/features/navbar";
import { StoreProvider } from "@/lib/redux/provider";

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
      <body>
        <StoreProvider>
          <StackProvider app={stackClientApp}>
            <StackTheme>
              <Navbar />
              <TooltipProvider>{children}</TooltipProvider>
            </StackTheme>
          </StackProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
