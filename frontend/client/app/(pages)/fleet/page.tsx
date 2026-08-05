"use client";

import React, { useEffect, useState } from 'react';
import { pricingApi } from '@/lib/api';
import { Car, Users, Briefcase, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function FleetPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await pricingApi.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            Our Premium <span className="text-primary">Fleet</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our wide range of well-maintained vehicles. Whether you're traveling solo or with a group, we have the perfect ride for you.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-3xl bg-card border border-border/60 overflow-hidden shadow-xl group hover:border-primary/50 transition-all flex flex-col">
                <div className="h-48 bg-secondary/50 flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  <Car size={80} className="text-primary/40 group-hover:scale-110 group-hover:text-primary transition-all duration-500 z-0" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-bold text-foreground">{cat.name}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-6 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cat.description || `Comfortable and reliable ${cat.name} for your journeys.`}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-lg">
                      <Users size={14} className="text-primary" /> {cat.capacity || 4} Seats
                    </span>
                    <span className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-lg">
                      <Briefcase size={14} className="text-primary" /> AC/Non-AC
                    </span>
                  </div>

                  <div className="space-y-2 mt-auto pt-4 border-t border-border/40">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={16} className="text-primary" /> Base Fare: ₹{cat.basePrice}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={16} className="text-primary" /> Per Km: ₹{cat.perKmRate}
                    </div>
                  </div>
                  
                  <Link href="/book" className="block w-full py-3 text-center rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-colors mt-4">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
