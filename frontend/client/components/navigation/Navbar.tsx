import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { name: "Services", href: "#services" },
  { name: "Destinations", href: "#destinations" },
  { name: "Spiritual", href: "#spiritual" },
  { name: "Fleet", href: "#fleet" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
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
          <Link
            href="#download"
            className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            App Download
          </Link>
        </div>
      </div>
    </header>
  );
}
