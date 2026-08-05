import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

import { Providers } from "./providers";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { MobileBottomNavigation } from "@/components/navigation/MobileBottomNavigation";
import { SubtleGrain } from "@/components/decorative/SubtleGrain";

export const metadata: Metadata = {
  title: "Udan Cabs",
  description: "Taxi booking platform for Ujjain City",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} h-full antialiased font-sans transition-colors duration-300`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          <SubtleGrain />
          <Navbar />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
          <MobileBottomNavigation />
        </Providers>
      </body>
    </html>
  );
}
