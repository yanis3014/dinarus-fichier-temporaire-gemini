// dinary-temp/dinarus/src/app/layout.tsx

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationsProvider } from "@/components/common/NotificationsContext";
import { ReferralProvider } from "@/components/common/ReferralContext";
import { ProfileModalProvider } from "@/components/common/ProfileModalContext";
import BottomNavbar from "@/components/layouts/BottomNavbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationsProvider>
            <ProfileModalProvider>
              <ReferralProvider>
                <div className="flex flex-col min-h-screen">
                  <div className="flex-grow">{children}</div>
                  <BottomNavbar />
                </div>
              </ReferralProvider>
            </ProfileModalProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
