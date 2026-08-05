"use client";

import React, { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
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
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background text-foreground">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-muted-foreground">
            Have questions about our services or need help planning your trip? We're here to assist you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-b border-border/60 pb-4">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone Number</h3>
                  <p className="text-muted-foreground mt-1">{settings?.contactPhone || '+91 9876543210'}</p>
                  <p className="text-muted-foreground">{settings?.whatsappNumber || '+91 9876543210'} (WhatsApp)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Address</h3>
                  <p className="text-muted-foreground mt-1">{settings?.contactEmail || 'support@udancabs.com'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Office Address</h3>
                  <p className="text-muted-foreground mt-1 leading-relaxed max-w-xs">
                    {settings?.address || '123 Mahakal Road, near Jyotirlinga, Ujjain, Madhya Pradesh 456001'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Operating Hours</h3>
                  <p className="text-muted-foreground mt-1">{settings?.operatingHours || '24/7 (Always Open)'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border shadow-xl rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully! Our team will contact you soon."); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-muted-foreground">First Name</label>
                  <input type="text" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="John" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-muted-foreground">Last Name</label>
                  <input type="text" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Doe" required />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground">Email or Phone</label>
                <input type="text" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="john@example.com / +91..." required />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground">Message</label>
                <textarea rows={4} className="w-full bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="How can we help you?" required></textarea>
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 mt-2">
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
