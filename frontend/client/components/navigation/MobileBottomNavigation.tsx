"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Car, BookOpen } from "lucide-react";
import { useBookingModal } from "@/components/modals/BookingModalProvider";

export function MobileBottomNavigation() {
  const pathname = usePathname();
  const { openModal } = useBookingModal();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal();
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary mobile navigation">
      <Link 
        href="/"
        className={`mobile-nav-item ${pathname === "/" ? "active" : ""}`}
        aria-current={pathname === "/" ? "page" : undefined}
      >
        <Home size={22} />
        <span>Home</span>
      </Link>

      <Link 
        href="/track"
        className={`mobile-nav-item ${pathname === "/track" ? "active" : ""}`}
        aria-current={pathname === "/track" ? "page" : undefined}
      >
        <MapPin size={22} />
        <span>Track Ride</span>
      </Link>

      <button 
        onClick={handleBookNow}
        className="mobile-nav-item mobile-nav-item--primary"
        aria-label="Book a ride now"
      >
        <div className="mobile-nav-icon">
          <Car size={24} />
        </div>
        <span>Book Now</span>
      </button>

      <Link 
        href="/#services"
        className="mobile-nav-item"
      >
        <BookOpen size={22} />
        <span>Pilgrimage</span>
      </Link>
    </nav>
  );
}
