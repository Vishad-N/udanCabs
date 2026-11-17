import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Udan Cabs in Ujjain for taxi bookings, tour enquiries and car rental support.",
  alternates: { canonical: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
