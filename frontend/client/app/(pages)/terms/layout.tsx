import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for booking taxis, tours and rentals with Udan Cabs.",
  alternates: { canonical: "/terms" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
