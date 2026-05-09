import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/SettingsContext";

export const metadata: Metadata = {
  title: "Undangan Wedding Habibie & Lathifa",
  description: "Wedding Reservation & Guestbook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
