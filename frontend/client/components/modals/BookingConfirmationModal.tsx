"use client";

import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Printer, ArrowRight, Home, MapPin, Calendar, Clock, User, Phone, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export function BookingConfirmationModal({ isOpen, onClose, booking }: BookingConfirmationModalProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  if (!isOpen || !booking) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.bookingNumber || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTrack = () => {
    onClose();
    router.push(`/track?id=${encodeURIComponent(booking.bookingNumber || booking.customerPhone)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in-0">
      <div className="relative w-full max-w-2xl rounded-3xl bg-card border border-border/60 p-6 sm:p-8 shadow-2xl text-card-foreground my-8">
        
        {/* Success Header Animation */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-border/40">
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-25"></span>
            <CheckCircle2 size={48} className="relative z-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Booking Confirmed!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your ride request has been saved and sent to our dispatch team.
          </p>

          {/* Booking Number Box */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-secondary/60 px-6 py-4 border border-border/50">
            <div className="text-left">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block">
                Booking Number
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-primary">
                {booking.bookingNumber || 'UC-PENDING'}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="ml-4 rounded-xl bg-background p-3 text-muted-foreground hover:text-foreground transition-all shadow-sm border border-border/40 hover:bg-secondary"
              title="Copy Booking Number"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="py-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
            <span className="text-sm font-medium text-foreground">Current Status</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              {booking.status || 'PENDING'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <User size={14} className="text-primary" /> Customer Info
              </h4>
              <p className="text-sm font-semibold text-foreground">{booking.customerName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone size={12} /> {booking.customerPhone}
              </p>
              {booking.customerEmail && (
                <p className="text-xs text-muted-foreground truncate">{booking.customerEmail}</p>
              )}
            </div>

            {/* Trip Type & Vehicle */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Car size={14} className="text-primary" /> Service & Vehicle
              </h4>
              <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                {booking.bookingType || 'CAB BOOKING'}
              </p>
              <p className="text-xs text-muted-foreground">
                Category: <span className="font-medium text-foreground">{booking.vehicleCategory || 'Sedan (4 Seater)'}</span>
              </p>
              {booking.passengers && (
                <p className="text-xs text-muted-foreground">Passengers: {booking.passengers}</p>
              )}
            </div>
          </div>

          {/* Journey Details */}
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" /> Journey Summary
            </h4>
            
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold text-muted-foreground w-16">Pickup:</span>
                <span className="font-medium text-foreground flex-1">{booking.pickupLocation || 'Ujjain City / Railway Station'}</span>
              </div>
              
              {booking.dropoffLocation && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-muted-foreground w-16">Dropoff:</span>
                  <span className="font-medium text-foreground flex-1">{booking.dropoffLocation}</span>
                </div>
              )}

              {booking.flightNumber && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-muted-foreground w-16">Flight #:</span>
                  <span className="font-medium text-foreground flex-1">{booking.flightNumber}</span>
                </div>
              )}

              {booking.rentalDuration && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-muted-foreground w-16">Duration:</span>
                  <span className="font-medium text-foreground flex-1">{booking.rentalDuration}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-border/40 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-primary" /> {booking.pickupDate || 'Today'}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-primary" /> {booking.pickupTime || 'Immediate'}
              </span>
            </div>
          </div>

          {/* Fare Placeholder Box */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/30">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                Estimated Fare
              </span>
              <span className="text-xs text-muted-foreground">
                Final price calculated based on distance, time & tolls
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-foreground">
                {booking.totalFare ? `₹${booking.totalFare.toLocaleString('en-IN')}` : '₹1,200*'}
              </span>
              <span className="text-[10px] text-muted-foreground block">(Estimated)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/50 text-sm font-semibold text-foreground hover:bg-secondary transition-all"
          >
            <Printer size={16} /> Print / Download
          </button>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-secondary text-sm font-semibold text-foreground hover:bg-secondary/80 transition-all"
            >
              <Home size={16} /> Return Home
            </button>
            
            <button
              onClick={handleTrack}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              Track Ride <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
