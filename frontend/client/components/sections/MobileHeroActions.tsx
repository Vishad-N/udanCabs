"use client";

import React from "react";
import { useBookingModal } from "@/components/modals/BookingModalProvider";

export function MobileHeroActions() {
  const { openModal } = useBookingModal();

  const handleBookRide = () => {
    openModal("Local Ride", null);
  };

  const handleExploreTours = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mobile-hero__actions">
      <button 
        onClick={handleBookRide} 
        className="button-primary flex items-center justify-center font-bold text-white transition-all bg-primary hover:bg-primary/90"
      >
        Book Your Ride
      </button>

      <button 
        onClick={handleExploreTours} 
        className="button-text text-white hover:text-primary transition-colors flex items-center gap-2 group"
      >
        Explore Darshan Tours
        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
      </button>
    </div>
  );
}
