import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about booking taxis, tours and rentals with Udan Cabs in Ujjain.",
  alternates: { canonical: "/faq" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
