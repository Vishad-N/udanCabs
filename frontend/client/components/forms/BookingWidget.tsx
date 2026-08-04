"use client";

import { useState } from "react";
import { Calendar, Clock, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingModal } from "@/components/modals/BookingModal";
import { BookingConfirmationModal } from "@/components/modals/BookingConfirmationModal";
import { LocationAutocomplete, LocationValue } from "@/components/inputs/LocationAutocomplete";

const TABS = ["Cab", "Airport", "Tours", "Rental"];

export function BookingWidget() {
  const [activeTab, setActiveTab] = useState("Cab");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupLat, setPickupLat] = useState<number | undefined>();
  const [pickupLng, setPickupLng] = useState<number | undefined>();
  
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffLat, setDropoffLat] = useState<number | undefined>();
  const [dropoffLng, setDropoffLng] = useState<number | undefined>();

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const handleFindRides = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-md rounded-3xl bg-card border border-border/50 p-6 shadow-2xl backdrop-blur-xl">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-full transition-all",
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {tab === "Rental" ? "Bike Rental" : tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <LocationAutocomplete
            value={pickupLocation}
            onChange={setPickupLocation}
            onSelectLocation={(val: LocationValue) => {
              setPickupLocation(val.address);
              setPickupLat(val.lat);
              setPickupLng(val.lng);
            }}
            placeholder={activeTab === "Rental" ? "Pickup Store / Location" : "Pickup location (e.g. Mahakal Temple)"}
            showCurrentLocation={true}
          />

          {activeTab !== "Rental" && (
            <>
              <div className="relative flex justify-center -my-2 z-10">
                <button
                  type="button"
                  onClick={() => {
                    const tempLoc = pickupLocation;
                    const tempLat = pickupLat;
                    const tempLng = pickupLng;
                    setPickupLocation(dropoffLocation);
                    setPickupLat(dropoffLat);
                    setPickupLng(dropoffLng);
                    setDropoffLocation(tempLoc);
                    setDropoffLat(tempLat);
                    setDropoffLng(tempLng);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border/50 text-muted-foreground hover:text-foreground transition-colors shadow-sm"
                >
                  <ArrowDownUp size={14} />
                </button>
              </div>

              <LocationAutocomplete
                value={dropoffLocation}
                onChange={setDropoffLocation}
                onSelectLocation={(val: LocationValue) => {
                  setDropoffLocation(val.address);
                  setDropoffLat(val.lat);
                  setDropoffLng(val.lng);
                }}
                placeholder={activeTab === "Airport" ? "Devi Ahilyabai Airport (IDR)" : "Drop destination (e.g. Indore Airport)"}
                showCurrentLocation={false}
              />
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-input/50 px-11 py-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Clock size={18} />
              </div>
              <input
                type="text"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full rounded-xl border border-border bg-input/50 px-11 py-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            onClick={handleFindRides}
            className="mt-4 w-full rounded-xl bg-primary py-4 text-center text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
          >
            {activeTab === "Rental" ? "Check Bike Availability" : "Find Rides & Book Now"}
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialTab={activeTab}
        initialData={{
          pickupLocation,
          dropoffLocation,
          pickupLat,
          pickupLng,
          dropoffLat,
          dropoffLng,
          pickupDate,
          pickupTime,
        }}
        onSuccess={(booking) => {
          setConfirmedBooking(booking);
        }}
      />

      <BookingConfirmationModal
        isOpen={!!confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        booking={confirmedBooking}
      />
    </>
  );
}
