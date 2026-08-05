"use client";

import React, { useEffect, useState } from 'react';
import { rentalApi } from '@/lib/api';
import { Bike, Shield, Gauge, Settings, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await rentalApi.getPublic();
        // Assuming API returns { data: [...] } for findAll
        setRentals(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            Two-Wheeler <span className="text-primary">Rentals</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the city at your own pace with our well-maintained fleet of scooters and motorcycles. Perfect for solo travelers and couples.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentals.map((bike) => (
              <div key={bike.id} className="rounded-3xl bg-card border border-border/60 overflow-hidden shadow-xl group hover:border-primary/50 transition-all flex flex-col">
                <div className="h-40 bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  <Bike size={60} className="text-primary/40 group-hover:scale-110 group-hover:text-primary transition-all duration-500 z-0" />
                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${bike.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                      {bike.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{bike.make} {bike.model}</h3>
                    <p className="text-xs text-muted-foreground">{bike.category}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-foreground">
                    <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                      <Gauge size={12} className="text-primary" /> Free 100km
                    </span>
                    <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                      <Shield size={12} className="text-primary" /> Insured
                    </span>
                    <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                      <Settings size={12} className="text-primary" /> Serviced
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/40">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Daily Rate</span>
                        <span className="text-xl font-bold text-primary">₹{bike.dailyRate}</span>
                      </div>
                      <Link 
                        href={`/book?rental=${bike.id}`} 
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${bike.status === 'AVAILABLE' ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25' : 'bg-muted text-muted-foreground pointer-events-none'}`}
                      >
                        {bike.status === 'AVAILABLE' ? 'Rent Now' : 'Booked'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
