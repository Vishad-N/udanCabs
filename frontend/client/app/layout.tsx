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
import { MetaPixel } from "@/components/analytics/MetaPixel";

export const metadata: Metadata = {
  metadataBase: new URL("https://udancab.com"),
  title: {
    default: "Udan Cabs - Taxi, Tours & Car Rentals in Ujjain",
    template: "%s | Udan Cabs",
  },
  description:
    "Book reliable taxis, Ujjain darshan tours and self-drive or chauffeur car rentals with Udan Cabs. Transparent pricing and verified drivers in Ujjain.",
  applicationName: "Udan Cabs",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://udancab.com",
    siteName: "Udan Cabs",
    title: "Udan Cabs - Taxi, Tours & Car Rentals in Ujjain",
    description:
      "Book reliable taxis, Ujjain darshan tours and car rentals with Udan Cabs.",
    locale: "en_IN",
    images: [{ url: "/logo.png", alt: "Udan Cabs" }],
  },
  twitter: {
    card: "summary",
    title: "Udan Cabs - Taxi, Tours & Car Rentals in Ujjain",
    description:
      "Book reliable taxis, Ujjain darshan tours and car rentals with Udan Cabs.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  name: "Udan Cabs",
  url: "https://udancab.com",
  logo: "https://udancab.com/logo.png",
  areaServed: { "@type": "City", name: "Ujjain" },
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
        <MetaPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
