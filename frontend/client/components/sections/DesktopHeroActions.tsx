"use client";

import React from "react";
import { useBookingModal } from "@/components/modals/BookingModalProvider";

export function DesktopHeroActions() {
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 w-full sm:w-auto">
      <button 
        onClick={handleBookRide}
        className="h-12 px-6 lg:px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 w-full sm:w-auto"
      >
        Book Your Ride
      </button>
      <button 
        onClick={handleExploreTours}
        className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group p-2"
      >
        Explore Darshan Tours
        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
      </button>
    </div>
  );
}
