'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { DownloadAppComingSoonModal } from "@/components/modals/DownloadAppComingSoonModal";

const NAV_LINKS = [
  { name: "Track Ride", href: "/track" },
  { name: "Services", href: "/#services" },
  { name: "Destinations", href: "/#destinations" },
  { name: "Spiritual", href: "/#spiritual" },
  { name: "Fleet", href: "/#fleet" },
];

export function Navbar() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <>
      <header data-tour="client-navbar" className="navbar mobile-header fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto flex md:h-20 h-[58px] items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Udan Cabs"
                width={200}
                height={56}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(true)}
              className="hidden h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              Download App
            </button>
          </div>
        </div>
      </header>

      <DownloadAppComingSoonModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </>
  );
}
