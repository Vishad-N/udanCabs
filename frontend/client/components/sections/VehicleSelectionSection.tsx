"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pricingApi } from '@/lib/api';
import { Check, ChevronRight } from 'lucide-react';
import { useBookingModal } from '@/components/modals/BookingModalProvider';
import { SectionWatermark } from '@/components/decorative/SectionWatermark';
import { RoutePattern } from '@/components/decorative/RoutePattern';
import { AmbientGlow } from '@/components/decorative/AmbientGlow';
import { SectionDivider } from '@/components/decorative/SectionDivider';

const MOCK_CATEGORIES = [
  {
    id: 'sedan',
    name: 'Premium Sedan',
    description: 'Comfortable rides for small families. Ideal for airport transfers and local sightseeing.',
    baseRate: '₹12/km',
    features: ['4 Seats', '2 Bags', 'AC', 'Chauffeur Driven'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80',
    popular: true,
  },
  {
    id: 'suv',
    name: 'Spacious SUV',
    description: 'Perfect for group darshans and outstation trips with extra luggage space.',
    baseRate: '₹16/km',
    features: ['6 Seats', '4 Bags', 'AC', 'Chauffeur Driven'],
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80',
    popular: false,
  },
  {
    id: 'luxury',
    name: 'Luxury Executive',
    description: 'Arrive in style. Premium vehicles for corporate travels and special occasions.',
    baseRate: '₹25/km',
    features: ['4 Seats', '3 Bags', 'Premium AC', 'Top Rated Driver'],
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80',
    popular: false,
  }
];

export function VehicleSelectionSection() {
  const { openModal } = useBookingModal();
  
  const { data, isLoading } = useQuery({
    queryKey: ['public-vehicle-categories'],
    queryFn: pricingApi.getCategories,
  });

  const apiCategories = data?.data?.data || [];
  
  // Use mock categories if API returns none so the section always looks good
  const displayCategories = apiCategories.length > 0 ? apiCategories.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description || 'Premium ride with top-class amenities.',
    baseRate: `₹${cat.baseFare}/km`,
    features: [`${cat.capacity || 4} Seats`, 'AC', 'Chauffeur'],
    image: cat.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80',
    popular: cat.isPopular || false,
  })) : MOCK_CATEGORIES;

  return (
    <section className="vehicle-section decorative-section padding-section bg-zinc-950/80">
      <SectionDivider className="absolute top-0 w-full" />
      <SectionWatermark text="RIDES" />
      <RoutePattern />
      <AmbientGlow variant="red" className="top-0 right-0 -translate-y-1/3 translate-x-1/3" />

      <div className="section-container container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-[#d97757] font-bold text-sm mb-3 tracking-widest uppercase">Choose Your Ride</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight font-sans">
            A Ride for Every Journey.
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            From affordable sedans to spacious SUVs, find the perfect vehicle for your Ujjain trip. Clean, sanitized, and driven by verified professionals.
          </p>
        </div>

        <div className="mobile-carousel grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayCategories.map((category: any) => (
            <div 
              key={category.id}
              className="vehicle-card group relative flex flex-col rounded-3xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden hover:border-red-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/20"
            >
              {category.popular && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-red-900/50">
                  Most Popular
                </div>
              )}
              
              <div className="vehicle-card__image relative aspect-[4/3] overflow-hidden bg-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent z-10" />
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="flex flex-col flex-grow p-6 relative z-20 -mt-10">
                <div className="flex items-end justify-between mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{category.name}</h3>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-zinc-500 block uppercase">Starting at</span>
                    <span className="text-lg font-black text-white">{category.baseRate}</span>
                  </div>
                </div>

                <p className="vehicle-card__description text-sm text-zinc-400 leading-relaxed mb-6 flex-grow">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {category.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-xs font-medium text-zinc-300">
                      <Check size={12} className="text-emerald-500" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => openModal(category.id)}
                  className="button-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-primary hover:text-white transition-colors group/btn"
                >
                  <span>Book Now</span>
                  <ChevronRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
