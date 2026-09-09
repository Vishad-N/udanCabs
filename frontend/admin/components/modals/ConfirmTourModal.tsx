"use client";

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { bookingsApi } from '@/lib/api';

interface ConfirmTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export function ConfirmTourModal({ isOpen, onClose, booking, onSuccess }: ConfirmTourModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [reportingDate, setReportingDate] = useState(booking?.pickupDate || '');
  const [reportingTime, setReportingTime] = useState(booking?.pickupTime || '');
  const [reportingPlace, setReportingPlace] = useState(booking?.pickupLocation || '');

  if (!isOpen || !booking) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await bookingsApi.confirmTour(booking.id, {
        reportingDate,
        reportingTime,
        reportingPlace,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to confirm tour and send receipt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl text-zinc-100">
        
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" /> Confirm Spiritual Tour
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Verify reporting details before generating receipt.</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleConfirm} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-red-500" /> Reporting Date
            </label>
            <input
              type="date"
              required
              value={reportingDate}
              onChange={(e) => setReportingDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-red-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <Clock size={14} className="text-red-500" /> Reporting Time
            </label>
            <input
              type="time"
              required
              value={reportingTime}
              onChange={(e) => setReportingTime(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-red-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
              <MapPin size={14} className="text-red-500" /> Reporting Place / Meeting Point
            </label>
            <textarea
              required
              rows={2}
              value={reportingPlace}
              onChange={(e) => setReportingPlace(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-red-600 transition-all resize-none"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 text-sm font-semibold text-white hover:bg-zinc-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>Confirm & Send PDF</>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
