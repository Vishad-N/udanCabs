"use client";

import React, { useEffect, useState } from 'react';
import { tourApi } from '@/lib/api';
import { Map, Clock, MapPin, CheckCircle2, Car } from 'lucide-react';
import Link from 'next/link';
import { useBookingModal } from '@/components/modals/BookingModalProvider';

function TourCard({ tour }: { tour: any }) {
  const carOptions = tour.carOptions ? (typeof tour.carOptions === 'string' ? JSON.parse(tour.carOptions) : tour.carOptions) : [];
  const [selectedCarIndex, setSelectedCarIndex] = useState<number>(0);
  const { openModal } = useBookingModal();

  // Determine the display price based on selection, or fallback to basePrice
  const displayPrice = carOptions.length > 0 && carOptions[selectedCarIndex]
    ? carOptions[selectedCarIndex].price
    : tour.basePrice || tour.price;

  const selectedCarName = carOptions.length > 0 && carOptions[selectedCarIndex]
    ? carOptions[selectedCarIndex].name
    : '';

  const handleBookTour = () => {
    openModal(undefined, {
      initialTab: 'Tours',
      dropoffLocation: tour.name,
    });
  };

  return (
    <div className="rounded-3xl bg-card border border-border/60 overflow-hidden shadow-xl group hover:border-primary/50 transition-all flex flex-col sm:flex-row">
      <div className="sm:w-2/5 h-48 sm:h-auto bg-secondary/50 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-background/80 to-transparent z-10" />
        <Map size={80} className="text-primary/40 group-hover:scale-110 group-hover:text-primary transition-all duration-500 z-0" />
      </div>
      <div className="p-6 space-y-4 flex-1 flex flex-col z-20 bg-card sm:-ml-4 sm:my-4 sm:rounded-l-2xl sm:shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.1)]">
        <h3 className="text-2xl font-bold text-foreground">{tour.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {tour.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-foreground pt-2">
          <span className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-lg">
            <Clock size={14} className="text-primary" /> {tour.duration}
          </span>
          <span className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-lg">
            <MapPin size={14} className="text-primary" /> Multi-stop
          </span>
        </div>

        {carOptions.length > 0 && (
          <div className="pt-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Select Preferred Car:</label>
            <div className="relative">
              <select
                value={selectedCarIndex}
                onChange={(e) => setSelectedCarIndex(Number(e.target.value))}
                className="w-full appearance-none bg-secondary/50 border border-border/50 text-foreground text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                {carOptions.map((opt: any, idx: number) => (
                  <option key={idx} value={idx}>
                    {opt.name} - ₹{opt.price}
                  </option>
                ))}
              </select>
              <Car size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/30">
          <div>
            <span className="text-xs text-muted-foreground block">
              {carOptions.length > 0 ? "Total Fare" : "Starting from"}
            </span>
            <span className="text-lg font-bold text-primary">₹{displayPrice}</span>
          </div>
          <button onClick={handleBookTour} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
            Book Tour
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await tourApi.getPublic();
        if (Array.isArray(res.data)) {
          setTours(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setTours(res.data.data);
        } else {
          setTours([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            Spiritual <span className="text-primary">Tours</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the divine heritage of Ujjain and surrounding regions with our specially crafted spiritual and sightseeing tour packages.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div data-tour="client-tours-list" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
