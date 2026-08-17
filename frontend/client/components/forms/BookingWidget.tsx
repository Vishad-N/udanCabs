"use client";

import { useState } from "react";
import { Calendar, Clock, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingModal } from "@/components/modals/BookingModalProvider";
import { LocationAutocomplete, LocationValue } from "@/components/inputs/LocationAutocomplete";

const TABS = ["Local Ride", "Airport", "Darshan Tour"];

export function BookingWidget() {
  const [activeTab, setActiveTab] = useState("Local Ride");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupLat, setPickupLat] = useState<number | undefined>();
  const [pickupLng, setPickupLng] = useState<number | undefined>();
  
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffLat, setDropoffLat] = useState<number | undefined>();
  const [dropoffLng, setDropoffLng] = useState<number | undefined>();

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const { openModal } = useBookingModal();

  const handleFindRides = () => {
    openModal(undefined, {
      pickupLocation,
      dropoffLocation,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      pickupDate,
      pickupTime,
    });
  };

  return (
    <>
      <div 
        data-tour="client-booking-widget"
        className="hero-booking-card w-full max-w-[450px] p-5 lg:p-6 flex flex-col gap-5"
        style={{
          background: 'rgba(15, 15, 15, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <h2 className="text-2xl font-bold text-white tracking-tight">Plan Your Journey</h2>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-white/10 pb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-2 text-sm font-semibold rounded-lg transition-all",
                activeTab === tab
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <LocationAutocomplete
            label="Pickup Location"
            value={pickupLocation}
            onChange={setPickupLocation}
            onSelectLocation={(val: LocationValue) => {
              setPickupLocation(val.address);
              setPickupLat(val.lat);
              setPickupLng(val.lng);
            }}
            placeholder="e.g. Mahakal Temple"
            showCurrentLocation={true}
          />

          <div className="relative flex justify-center -my-3 z-10">
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
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] border border-white/10 text-white/60 hover:text-white transition-colors shadow-sm"
            >
              <ArrowDownUp size={14} />
            </button>
          </div>

          <LocationAutocomplete
            label="Destination"
            value={dropoffLocation}
            onChange={setDropoffLocation}
            onSelectLocation={(val: LocationValue) => {
              setDropoffLocation(val.address);
              setDropoffLat(val.lat);
              setDropoffLng(val.lng);
            }}
            placeholder={activeTab === "Airport" ? "Devi Ahilyabai Airport (IDR)" : "e.g. Indore Airport"}
            showCurrentLocation={false}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider ml-1">Date</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full rounded-[10px] border border-white/10 bg-white/5 px-10 py-2 text-sm font-medium text-white outline-none transition-all focus:border-primary focus:bg-white/10"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider ml-1">Time</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Clock size={16} />
                </div>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="10:30 AM"
                  className="w-full rounded-[10px] border border-white/10 bg-white/5 px-10 py-2 text-sm font-medium text-white outline-none transition-all placeholder:text-white/30 focus:border-primary focus:bg-white/10"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleFindRides}
            className="mt-4 w-full rounded-[10px] bg-primary py-3 text-center text-[15px] font-bold text-white transition-all hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
          >
            Check Available Rides
          </button>
          
          <p className="text-center text-[12.5px] text-white/40 font-medium pt-2">
            No advance payment &middot; Verified local drivers
          </p>
        </div>
      </div>
    </>
  );
}
