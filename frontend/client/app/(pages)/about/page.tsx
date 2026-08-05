"use client";

import React, { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api';
import { Building2, ShieldCheck, Clock, Users, Star, Car } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsApi.getPublic();
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 mb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary uppercase tracking-widest">
            <Building2 size={16} /> {settings?.companyName || 'Udan Cabs'}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Your Trusted Travel Partner in <span className="text-primary">Ujjain</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {settings?.description || "Providing premium, safe, and reliable taxi services across Ujjain and Madhya Pradesh. Whether it's a spiritual tour to Mahakaleshwar or an airport transfer, we ensure you travel with comfort and peace of mind."}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-secondary/30 py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Safe & Secure', desc: 'Verified drivers and well-maintained fleet for your safety.' },
              { icon: Clock, title: '24/7 Availability', desc: 'Round-the-clock service to cater to all your travel needs.' },
              { icon: Star, title: 'Premium Service', desc: 'Experience comfort with our clean and modern vehicles.' },
              { icon: Users, title: 'Expert Drivers', desc: 'Professional, courteous, and knowledgeable local drivers.' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-card p-6 rounded-3xl border border-border shadow-lg flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-colors">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded with a vision to revolutionize local and intercity travel in Ujjain, {settings?.companyName || 'Udan Cabs'} has grown to become the city's most preferred mobility partner. 
              </p>
              <p>
                Our deep understanding of the city's spiritual significance, coupled with our commitment to customer satisfaction, allows us to provide seamless experiences for pilgrims and tourists alike.
              </p>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 absolute -inset-4 z-0 blur-2xl"></div>
            <div className="aspect-square rounded-3xl bg-secondary border border-border overflow-hidden relative z-10 flex items-center justify-center">
              <Car size={120} className="text-primary/20" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
