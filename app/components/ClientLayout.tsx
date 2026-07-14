'use client';

import { AuthProvider } from "@/context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import QuickActionsDock from "./QuickActionsDock";
import PWAInit from "./PWAInit";
import Toast from "./Toast";
import Analytics from "./Analytics";
import MobileOptimized from "./MobileOptimized";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
      <QuickActionsDock />
      <PWAInit />
      <Toast />
      <Analytics />
      <MobileOptimized />
    </AuthProvider>
  );
}
