"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, Eye, RefreshCw, AlertCircle, Loader2, CalendarCheck, Car, Phone, User } from 'lucide-react';
import { bookingsApi } from '@/lib/api';
import { BookingDetailsModal } from '@/components/modals/BookingDetailsModal';

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-bookings', search, status, date, page, limit],
    queryFn: () => bookingsApi.getAll({ search, status, date, page, limit }),
  });

  const responseData = data?.data || data;
  const rawBookings = responseData?.data || responseData;
  const bookings = Array.isArray(rawBookings) ? rawBookings : [];
  const meta = responseData?.meta || { total: 0, page: 1, totalPages: 1 };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'CONFIRMED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'DRIVER_ASSIGNED':
      case 'DRIVER_ON_THE_WAY':
      case 'TRIP_STARTED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'COMPLETED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'PENDING':
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarCheck size={14} /> Dispatch & Bookings
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Ride Bookings Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Monitor live customer booking requests, assign dispatch status, and inspect trip timelines.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs font-semibold transition-all border border-zinc-700/60 shadow-sm"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Booking #, Name, Phone..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-red-600 transition-all placeholder:text-zinc-600 font-medium"
          />
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[170px]">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-red-600 transition-all font-medium appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DRIVER_ASSIGNED">Driver Assigned</option>
            <option value="COMPLETED">Completed Trips</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={14} />
        </div>

        {/* Date Filter */}
        <div className="relative min-w-[160px]">
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-red-600 transition-all font-medium"
          />
        </div>

        {(search || status || date) && (
          <button
            onClick={() => {
              setSearch('');
              setStatus('');
              setDate('');
              setPage(1);
            }}
            className="px-3 py-2.5 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20 text-xs font-semibold transition-all border border-red-600/20"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-3">
            <Loader2 size={32} className="animate-spin text-red-600" />
            <span className="text-sm font-medium">Loading Bookings Inventory...</span>
          </div>
        ) : isError ? (
          <div className="py-16 flex flex-col items-center justify-center text-red-400 gap-2">
            <AlertCircle size={32} />
            <span className="text-sm font-bold">Failed to load bookings</span>
            <button onClick={() => refetch()} className="text-xs underline text-zinc-400 mt-1">Try again</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-2">
            <CalendarCheck size={40} className="text-zinc-700 mb-2" />
            <span className="text-base font-bold text-zinc-400">No bookings found</span>
            <span className="text-xs text-zinc-600">Try adjusting your filters or search terms.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-6">Booking Number</th>
                  <th className="py-4 px-6">Customer Details</th>
                  <th className="py-4 px-6">Service & Fleet</th>
                  <th className="py-4 px-6">Route / Itinerary</th>
                  <th className="py-4 px-6">Travel Schedule</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {Array.isArray(bookings) && bookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-zinc-800/40 transition-colors group">
                    <td className="py-4 px-6 font-bold text-white">
                      <span className="text-red-400 font-mono text-sm">{booking.bookingNumber || 'UC-PENDING'}</span>
                      <span className="block text-[10px] text-zinc-500 font-normal mt-0.5">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <User size={12} className="text-zinc-500" /> {booking.customerName}
                      </div>
                      <div className="text-zinc-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <Phone size={12} className="text-zinc-500" /> {booking.customerPhone}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-block font-extrabold text-white bg-zinc-800 px-2 py-0.5 rounded text-[10px] uppercase mb-1">
                        {booking.bookingType || 'CAB'}
                      </span>
                      <div className="text-zinc-300 font-medium">{booking.vehicleCategory || 'Sedan'}</div>
                      {booking.passengers && (
                        <div className="text-[10px] text-zinc-500">{booking.passengers} Passengers</div>
                      )}
                      {booking.assignedDriver && (
                        <div className="mt-1.5 flex flex-col gap-0.5">
                          <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded inline-block w-fit">
                            Driver: {booking.assignedDriver.name}
                          </span>
                          {booking.assignedVehicle && (
                            <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded inline-block w-fit">
                              Vehicle: {booking.assignedVehicle.plateNumber}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-semibold text-zinc-200 truncate" title={booking.pickupLocation}>
                        📍 {booking.pickupLocation || 'Ujjain City'}
                      </div>
                      {booking.dropoffLocation && (
                        <div className="text-zinc-400 text-[11px] truncate mt-0.5" title={booking.dropoffLocation}>
                          🏁 {booking.dropoffLocation}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 font-medium text-zinc-300">
                      <div>📅 {booking.pickupDate || 'Today'}</div>
                      <div className="text-zinc-500 text-[11px] mt-0.5">⏰ {booking.pickupTime || 'Immediate'}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(booking.status)}`}>
                        {booking.status === 'PENDING' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                        {booking.status || 'PENDING'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white transition-all font-semibold shadow-sm"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/40 border-t border-zinc-800/80 text-xs">
            <span className="text-zinc-400 font-medium">
              Showing Page <strong className="text-white">{meta.page}</strong> of <strong className="text-white">{meta.totalPages}</strong> ({meta.total} records)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <BookingDetailsModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
        onUpdate={() => refetch()}
      />

    </div>
  );
}
