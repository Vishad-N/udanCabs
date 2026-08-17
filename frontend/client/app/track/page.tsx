"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Calendar, Clock, Car, Phone, User, CheckCircle2, Circle, AlertCircle, Loader2, ArrowRight, ShieldCheck, Printer, XCircle } from 'lucide-react';
import { bookingApi } from '@/lib/api';

function TrackBookingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [query, setQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  const handleSearch = async (searchVal: string) => {
    if (!searchVal || searchVal.trim() === '') {
      setErrorMsg('Please enter a valid Booking Number or Mobile Number.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await bookingApi.track(searchVal);
      const responseData = res?.data ?? res;
      const list = responseData?.data ?? responseData;
      if (Array.isArray(list) && list.length > 0) {
        setBookings(list);
      } else {
        setBookings([]);
        setErrorMsg('No active bookings found matching this Booking Number or Mobile Number.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to lookup bookings. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (booking: any) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    try {
      await bookingApi.cancelPublic({
        bookingNumber: booking.bookingNumber,
        customerPhone: booking.customerPhone,
      });
      alert('Booking cancelled successfully.');
      handleSearch(query);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background text-foreground overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: "url('/images/track-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 print:hidden backdrop-blur-md bg-background/40 p-6 rounded-3xl max-w-2xl mx-auto border border-border/10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck size={14} /> LIVE BOOKING TRACKER
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Track Your <span className="text-primary">Journey</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Enter your Booking Number (e.g. UC-20260727-0001) or Registered Mobile Number to check real-time trip status, download receipt, or cancel your booking.
          </p>
        </div>

        {/* Search Input Box */}
        <div data-tour="client-track-search" className="max-w-2xl mx-auto rounded-3xl bg-card border border-border/60 p-4 sm:p-6 shadow-xl print:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Booking ID or Mobile Number..."
                className="w-full rounded-2xl border border-border bg-input/50 pl-12 pr-4 py-4 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Track Ride</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/25 p-4 text-sm text-destructive">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Results List */}
        {Array.isArray(bookings) && bookings.length > 0 && (
          <div className="space-y-6 pt-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>Matching Bookings</span>
              <span className="rounded-full bg-primary/15 text-primary text-xs px-2.5 py-0.5 font-semibold">
                {bookings.length} Found
              </span>
            </h2>

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl bg-card border border-border/60 overflow-hidden shadow-xl transition-all hover:border-border"
              >
                {/* Card Top Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-secondary/30 border-b border-border/40">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Booking Number
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-primary">
                      {booking.bookingNumber || 'UC-PENDING'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse print:hidden"></span>
                      {booking.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="px-6 pt-4 pb-2 flex flex-wrap gap-2 print:hidden border-b border-border/40 bg-card">
                   <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-xs font-bold text-secondary-foreground hover:bg-secondary/80 transition-colors">
                     <Printer size={14} /> Download Receipt
                   </button>
                   {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                     <button onClick={() => handleCancel(booking)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors">
                       <XCircle size={14} /> Cancel Booking
                     </button>
                   )}
                   {booking.assignedDriver && (
                     <a href={`tel:${booking.assignedDriver.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold hover:bg-green-500/20 transition-colors">
                       <Phone size={14} /> Call Driver
                     </a>
                   )}
                   <a href={`tel:919876543210`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                     <Phone size={14} /> Call Office
                   </a>
                </div>

                {/* Card Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Trip & Customer */}
                  <div className="space-y-4 md:col-span-1 border-b md:border-b-0 md:border-r border-border/40 pb-6 md:pb-0 md:pr-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Car size={14} className="text-primary" /> Service Details
                    </h3>

                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-foreground uppercase tracking-wide">
                        {booking.bookingType || 'CAB BOOKING'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Category: <span className="font-medium text-foreground">{booking.vehicleCategory || 'Sedan'}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Fare: <span className="font-medium text-foreground">₹{booking.totalFare || booking.estimatedFare}</span>
                      </p>
                      {booking.paymentMethod && (
                        <p className="text-xs text-muted-foreground">
                          Payment: <span className="font-medium text-foreground">{booking.paymentMethod}</span>
                        </p>
                      )}
                      {booking.passengers && (
                        <p className="text-xs text-muted-foreground">Passengers: {booking.passengers}</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/40 space-y-1.5 text-xs">
                      <p className="font-semibold text-foreground flex items-center gap-1.5">
                        <User size={14} className="text-muted-foreground" /> {booking.customerName}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1.5">
                        <Phone size={14} className="text-muted-foreground" /> {booking.customerPhone}
                      </p>
                    </div>

                    {/* Driver & Vehicle Placeholder */}
                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                        Assigned Driver & Fleet
                      </span>
                      {booking.assignedDriver ? (
                        <>
                          <p className="text-xs font-semibold text-foreground">
                            {booking.assignedDriver.name} ({booking.assignedDriver.phone})
                          </p>
                          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                            {booking.assignedVehicle 
                              ? `${booking.assignedVehicle.make} ${booking.assignedVehicle.model} • ${booking.assignedVehicle.plateNumber.toUpperCase()}` 
                              : 'Vehicle dispatched'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-foreground">
                            Assignment in progress...
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            You will receive driver details once confirmed by dispatch.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Journey Route */}
                  <div className="space-y-4 md:col-span-1 border-b md:border-b-0 md:border-r border-border/40 pb-6 md:pb-0 md:pr-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary" /> Journey Route
                    </h3>

                    <div className="space-y-4 relative before:absolute before:left-2 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-border/60 pl-6">
                      <div className="relative">
                        <span className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-card"></span>
                        <span className="text-[11px] font-bold uppercase text-muted-foreground block">Pickup</span>
                        <p className="text-sm font-medium text-foreground">{booking.pickupLocation || 'Ujjain City'}</p>
                      </div>

                      {booking.dropoffLocation && (
                        <div className="relative">
                          <span className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-primary border-4 border-card"></span>
                          <span className="text-[11px] font-bold uppercase text-muted-foreground block">Dropoff</span>
                          <p className="text-sm font-medium text-foreground">{booking.dropoffLocation}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-primary" /> {booking.pickupDate || 'Today'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-primary" /> {booking.pickupTime || 'Immediate'}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Status Timeline */}
                  <div className="space-y-4 md:col-span-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock size={14} className="text-primary" /> Status Timeline
                    </h3>

                    <div className="space-y-4">
                      {booking.timeline && booking.timeline.length > 0 ? (
                        booking.timeline.map((item: any, idx: number) => {
                          const title = item.event || item.title || item.status;
                          const timestamp = item.createdAt || item.timestamp;
                          const note = item.remarks || item.note;
                          const isLast = idx === booking.timeline.length - 1;
                          return (
                            <div key={idx} className="flex items-start gap-3 relative">
                              {!isLast && (
                                <span className="absolute left-2.5 top-6 -bottom-4 w-0.5 bg-primary/30"></span>
                              )}
                              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                {isLast ? <CheckCircle2 size={14} /> : <Circle size={10} className="fill-current" />}
                              </div>
                              <div className="flex-1 text-xs space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-foreground">{title}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                  </span>
                                </div>
                                {note && (
                                  <p className="text-muted-foreground text-[11px] leading-relaxed">{note}</p>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-primary mt-0.5" />
                          <div className="text-xs">
                            <p className="font-bold text-foreground">Booking Received</p>
                            <p className="text-muted-foreground text-[11px]">Awaiting dispatch confirmation</p>
                          </div>
                        </div>
                      )}
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

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-muted-foreground">Loading Tracker...</div>}>
      <TrackBookingContent />
    </Suspense>
  );
}
