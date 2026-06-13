import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Tutor Connect - Nền tảng Gia sư Hàng đầu",
  description: "Kết nối học sinh và gia sư nhanh chóng, hiệu quả với trải nghiệm tuyệt vời.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from '@/context/AuthContext';
import { RealtimeProvider } from '@/context/RealtimeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable}`}>
      <body>
        <AuthProvider>
          <RealtimeProvider>
            <Navbar />
            <main className="app-main" style={{ flex: 1 }}>
              {children}
            </main>
          </RealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
