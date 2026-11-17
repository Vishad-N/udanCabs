import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ujjain Tours & Darshan Packages",
  description: "Book Ujjain darshan and sightseeing tours, including Mahakaleshwar and nearby temples, with Udan Cabs.",
  alternates: { canonical: "/tours" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
