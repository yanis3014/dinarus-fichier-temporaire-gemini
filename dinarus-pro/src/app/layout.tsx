// dinary-temp/dinaruspro-frontend/src/app/layout.tsx

import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dinary Pro",
  description: "Application de gestion pour Dinary Pro",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
