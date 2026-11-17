import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Udan Cabs collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
