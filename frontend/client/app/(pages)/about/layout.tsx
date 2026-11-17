import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Udan Cabs, Ujjain's trusted taxi and tour service with verified drivers and a well-kept fleet.",
  alternates: { canonical: "/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
