import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from './_components/Analytics';
import { Suspense } from 'react';
import AuroraBackground from "@/components/AuroraBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Crypto Shinchan Blog",
  description: "Blog about Crypto, by Shinchan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-dvh bg-transparent text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div data-aurora-mask>
            <AuroraBackground />
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <Layout>{children}</Layout>
          </Suspense>
        </ThemeProvider>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}