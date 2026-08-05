"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { BookingModal } from "./BookingModal";
import { BookingConfirmationModal } from "./BookingConfirmationModal";

interface BookingModalContextType {
  openModal: (categoryId?: string, initialData?: any) => void;
  closeModal: () => void;
  setConfirmedBooking: (booking: any) => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState<any>({});
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const openModal = (categoryId?: string, data?: any) => {
    setInitialData({ ...data, categoryId });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <BookingModalContext.Provider value={{ openModal, closeModal, setConfirmedBooking }}>
      {children}
      
      <BookingModal
        isOpen={isOpen}
        onClose={closeModal}
        initialTab="Local Ride"
        initialData={initialData}
        onSuccess={(booking) => setConfirmedBooking(booking)}
      />

      <BookingConfirmationModal
        isOpen={!!confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        booking={confirmedBooking}
      />
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (context === undefined) {
    throw new Error("useBookingModal must be used within a BookingModalProvider");
  }
  return context;
}
