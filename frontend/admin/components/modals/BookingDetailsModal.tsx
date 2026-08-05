"use client";

import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, Clock, Car, CheckCircle2, Circle, AlertCircle, Loader2, Edit3, Send, ShieldAlert, Trash2 } from 'lucide-react';
import { bookingsApi } from '@/lib/api';
import { AssignDriverModal } from './AssignDriverModal';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onUpdate: () => void;
}

export function BookingDetailsModal({ isOpen, onClose, booking, onUpdate }: BookingDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(booking?.status || 'PENDING');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await bookingsApi.updateStatus(booking.id, {
        status: newStatus,
        note: note || `Admin updated status to ${newStatus}`,
      });
      setNote('');
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to update booking status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive/cancel this booking?')) return;
    setLoading(true);
    try {
      await bookingsApi.delete(booking.id);
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to archive booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div className="relative w-full max-w-4xl rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl text-zinc-100 max-h-[95vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-500 block">
              Booking Inspection
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {booking.bookingNumber || 'UC-PENDING'}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-600/30">
                {booking.status || 'PENDING'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              title="Archive Booking"
              className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
          
          {/* Left Column: Customer & Service Info */}
          <div className="space-y-6 md:col-span-1">
            
            {/* Customer Details */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <User size={14} className="text-red-500" /> Customer Information
              </h3>
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-white text-base">{booking.customerName}</p>
                <p className="text-zinc-300 flex items-center gap-2">
                  <Phone size={14} className="text-zinc-500" /> {booking.customerPhone}
                </p>
                {booking.customerEmail && (
                  <p className="text-zinc-400 text-xs flex items-center gap-2 truncate">
                    <Mail size={14} className="text-zinc-500" /> {booking.customerEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Service & Vehicle Info */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Car size={14} className="text-red-500" /> Service Category
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs">Type:</span>
                  <span className="font-bold text-red-400 uppercase tracking-wide">{booking.bookingType || 'CAB'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs">Category:</span>
                  <span className="font-medium text-white">{booking.vehicleCategory || 'Sedan'}</span>
                </div>
                {booking.passengers && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-xs">Passengers:</span>
                    <span className="font-medium text-white">{booking.passengers}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                  <span className="text-zinc-500 text-xs font-bold">Estimated Fare:</span>
                  <span className="font-black text-emerald-400 text-base">
                    {booking.totalFare ? `₹${booking.totalFare.toLocaleString('en-IN')}` : '₹1,200'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
                <span className="font-bold uppercase tracking-wider block text-[10px]">Customer Notes:</span>
                <p className="leading-relaxed">{booking.notes}</p>
              </div>
            )}

          </div>

          {/* Middle Column: Journey & Status Updater */}
          <div className="space-y-6 md:col-span-1">
            
            {/* Journey Summary */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MapPin size={14} className="text-red-500" /> Journey Itinerary
              </h3>

              <div className="space-y-4 relative before:absolute before:left-2 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-zinc-800 pl-6">
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-zinc-950"></span>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Pickup Location</span>
                  <p className="text-sm font-semibold text-white">{booking.pickupLocation || 'Ujjain City'}</p>
                </div>

                {booking.dropoffLocation && (
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-red-500 border-4 border-zinc-950"></span>
                    <span className="text-[10px] font-bold uppercase text-zinc-500 block">Dropoff Destination</span>
                    <p className="text-sm font-semibold text-white">{booking.dropoffLocation}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={14} className="text-red-500" /> {booking.pickupDate || 'Today'}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock size={14} className="text-red-500" /> {booking.pickupTime || 'Immediate'}
                </span>
              </div>
            </div>

            {/* Quick Status Action Controls */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Edit3 size={14} className="text-red-500" /> Admin Lifecycle Action
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Add Dispatch Note / Driver Detail
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Assigned Driver Rajesh (MP13 AB 1234)..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-red-600 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleStatusUpdate('CONFIRMED')}
                    disabled={loading || booking.status === 'CONFIRMED'}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/30 text-xs font-bold transition-all disabled:opacity-40"
                  >
                    Confirm Ride
                  </button>

                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30 text-xs font-bold transition-all disabled:opacity-40"
                  >
                    {booking.assignedDriverId ? 'Change Fleet/Driver' : 'Assign Fleet/Driver'}
                  </button>

                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={loading || booking.status === 'COMPLETED'}
                    className="py-2.5 px-3 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-600/30 text-xs font-bold transition-all disabled:opacity-40"
                  >
                    Complete Trip
                  </button>

                  <button
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    disabled={loading || booking.status === 'CANCELLED'}
                    className="py-2.5 px-3 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 text-xs font-bold transition-all disabled:opacity-40"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Status Timeline Log */}
          <div className="space-y-6 md:col-span-1">
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4 h-full">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Clock size={14} className="text-red-500" /> Audit & Status Timeline
              </h3>

              <div className="space-y-5 pt-2">
                {Array.isArray(booking.timeline) && booking.timeline.length > 0 ? (
                  booking.timeline.map((item: any, idx: number) => {
                    const title = item.event || item.title || item.status;
                    const timestamp = item.createdAt || item.timestamp;
                    const note = item.remarks || item.note;
                    const isLast = idx === booking.timeline.length - 1;
                    return (
                      <div key={idx} className="flex items-start gap-3 relative">
                        {!isLast && (
                          <span className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-800"></span>
                        )}
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-red-500">
                          {isLast ? <CheckCircle2 size={14} /> : <Circle size={10} className="fill-current" />}
                        </div>
                        <div className="flex-1 text-xs space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{title}</span>
                            <span className="text-[10px] text-zinc-500">
                              {timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          {note && (
                            <p className="text-zinc-400 text-[11px] leading-relaxed bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60 mt-1">
                              {note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-zinc-500 italic">No timeline history recorded.</p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>

      <AssignDriverModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        booking={booking}
        onSuccess={() => {
          onUpdate();
        }}
      />
    </div>
  );
}
