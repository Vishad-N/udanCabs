"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CalendarCheck, Users, Car, MapPin, Bike, ArrowRight, ShieldCheck, Clock, CheckCircle2, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

export default function DashboardHome() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const res = await api.get('/settings/statistics');
        return res.data?.data || {};
      } catch {
        return {
          totalBookings: 0,
          pendingTrips: 0,
          activeDrivers: 0,
          fleetCount: 0,
          activeTours: 0,
          rentalBikes: 0,
        };
      }
    },
  });

  const stats = statsData || {
    totalBookings: 12,
    pendingTrips: 3,
    activeDrivers: 8,
    fleetCount: 15,
    activeTours: 5,
    rentalBikes: 10,
  };

  const statCards = [
    { title: 'Total Bookings', value: stats.totalBookings ?? 12, icon: CalendarCheck, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', href: '/bookings' },
    { title: 'Pending Dispatch', value: stats.pendingTrips ?? 3, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', badge: 'Action Needed', href: '/bookings?status=PENDING' },
    { title: 'Active Drivers', value: stats.activeDrivers ?? 8, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', href: '/drivers' },
    { title: 'Fleet Vehicles', value: stats.fleetCount ?? 15, icon: Car, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', href: '/vehicles' },
    { title: 'Spiritual Tours', value: stats.activeTours ?? 5, icon: MapPin, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', href: '/tours' },
    { title: 'Rental Bikes', value: stats.rentalBikes ?? 10, icon: Bike, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', href: '/rentals' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 border border-zinc-800 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} /> Ujjain Operational Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome to <span className="text-red-500">Udan Cabs</span> Dispatch
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Manage your daily rides, dispatch drivers to Mahakaleshwar & Omkareshwar tourists, maintain fleet inventory, and configure dynamic pricing across Ujjain city.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 transition-all shadow-lg shadow-red-600/25"
            >
              <span>Manage Live Bookings</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/drivers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 text-zinc-200 font-semibold text-sm hover:bg-zinc-700 transition-all border border-zinc-700"
            >
              <span>Driver Roster</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-red-500" />
            <span>Operational Statistics</span>
          </h2>
          {isLoading && <Loader2 size={16} className="animate-spin text-red-500" />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group p-6 rounded-3xl bg-zinc-900 border ${card.border} hover:border-zinc-700 transition-all shadow-xl flex flex-col justify-between relative overflow-hidden`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                      {card.title}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {card.value}
                    </span>
                  </div>
                  <div className={`p-3 rounded-2xl ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
                    <Icon size={24} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 text-xs font-semibold text-zinc-400 group-hover:text-zinc-200">
                  <span>View Details</span>
                  {card.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {card.badge}
                    </span>
                  ) : (
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" /> Dispatch Best Practices
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Ensure all incoming pending rides are confirmed within 10 minutes. When assigning a driver, include their mobile number and vehicle plate number in the status note so customers can track their ride easily.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" /> Ujjain Peak Season Notice
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            During Shravan month and Mahakal Bhasma Aarti hours (3:00 AM - 6:00 AM), ensure extra driver availability and verify temple road closures before confirming pickup routes.
          </p>
        </div>
      </div>

    </div>
  );
}
