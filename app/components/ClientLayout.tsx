'use client';

import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Header from "./Header";
import Footer from "./Footer";
import QuickActionsDock from "./QuickActionsDock";
import PWAInit from "./PWAInit";
import Toast from "./Toast";
import Analytics from "./Analytics";
import MobileOptimized from "./MobileOptimized";
import { NotificationContainer } from "./NotificationContainer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
          <Header />
          <main className="flex-1 bg-white">{children}</main>
          <Footer />
          <QuickActionsDock />
          <PWAInit />
          <Toast />
          <Analytics />
          <MobileOptimized />
          <NotificationContainer />
        </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
