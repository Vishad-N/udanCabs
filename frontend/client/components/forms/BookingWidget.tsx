"use client";

import { useState } from "react";
import { Calendar, Clock, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingModal } from "@/components/modals/BookingModalProvider";
import { LocationAutocomplete, LocationValue } from "@/components/inputs/LocationAutocomplete";
import { tourApi } from "@/lib/api";
import { useEffect } from "react";

const TABS = ["Local Ride", "Darshan Tour"];

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

  const [tourPackages, setTourPackages] = useState<any[]>([]);
  const [selectedTour, setSelectedTour] = useState("");

  const { openModal } = useBookingModal();

  useEffect(() => {
    if (activeTab === "Darshan Tour") {
      tourApi.getPublic().then((res: any) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setTourPackages(data);
      }).catch(console.error);
    }
  }, [activeTab]);

  const handleFindRides = () => {
    let tabId = "Cab";
    if (activeTab === "Airport") tabId = "Airport";
    if (activeTab === "Darshan Tour") tabId = "Tours";

    openModal(undefined, {
      pickupLocation,
      dropoffLocation,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      pickupDate,
      pickupTime,
      initialTab: tabId,
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
          {activeTab === "Darshan Tour" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Select Tour Package</label>
                <select
                  value={selectedTour}
                  onChange={(e) => setSelectedTour(e.target.value)}
                  className="w-full h-[52px] bg-[#1a1a1a] border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
                >
                  <option value="" disabled>Choose a spiritual tour...</option>
                  {tourPackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - ₹{pkg.basePrice || pkg.price}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pt-8">
                  <ArrowDownUp size={14} className="text-white/40 opacity-0" />
                </div>
              </div>
            </div>
          ) : (
            <>
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
                placeholder="e.g. Indore Airport"
                showCurrentLocation={false}
              />
            </>
          )}

          <div className="pt-2">
            <button
              onClick={handleFindRides}
              className="mt-4 w-full rounded-[10px] bg-primary py-3 text-center text-[15px] font-bold text-white transition-all hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            >
              Check Available Rides
            </button>
          </div>
          
          <p className="text-center text-[12.5px] text-white/40 font-medium pt-2">
            No advance payment &middot; Verified local drivers
          </p>
        </div>
      </div>
    </>
  );
}
