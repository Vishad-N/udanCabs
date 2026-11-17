import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Rentals in Ujjain",
  description: "Rent a car with a driver in Ujjain. Flexible hourly and daily car rental packages from Udan Cabs.",
  alternates: { canonical: "/rentals" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
