import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Manrope, Playfair_Display, Poppins, Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#A0522D" },
    { media: "(prefers-color-scheme: dark)", color: "#E8D4C4" },
  ],
};

export const metadata: Metadata = {
  title: "KATHIR LTD - Premium Wholesale Ordering Portal",
  description: "Sowing * Reaping and Giving the Best - Professional wholesale food & agricultural products distribution",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KATHIR LTD",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${playfair.variable} ${poppins.variable} ${inter.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col" style={{ background: '#ffffff' }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

