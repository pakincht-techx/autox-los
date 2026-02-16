import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";

const ibmPlexSansThaiLooped = IBM_Plex_Sans_Thai_Looped({
  variable: "--font-ibm-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบสินเชื่อสาขา - เงินไชโย", // Thai Title
  description: "AutoX Loan Origination System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${ibmPlexSansThaiLooped.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
