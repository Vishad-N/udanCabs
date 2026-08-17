"use client";

import React, { useEffect, useState } from 'react';
import { tourApi } from '@/lib/api';
import { Map, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await tourApi.getPublic();
        setTours(res.data || []);
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
              <div key={tour.id} className="rounded-3xl bg-card border border-border/60 overflow-hidden shadow-xl group hover:border-primary/50 transition-all flex flex-col sm:flex-row">
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

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block">Starting from</span>
                      <span className="text-lg font-bold text-primary">₹{tour.basePrice}</span>
                    </div>
                    <Link href={`/book?tour=${tour.id}`} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                      Book Tour
                    </Link>
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
