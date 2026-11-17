import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Fleet",
  description: "Explore the Udan Cabs fleet: sedans, SUVs and tourist vehicles available for taxis, tours and rentals in Ujjain.",
  alternates: { canonical: "/fleet" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
