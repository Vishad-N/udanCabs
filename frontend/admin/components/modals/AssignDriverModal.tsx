"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Car, Loader2, Check, AlertCircle } from 'lucide-react';
import { driversApi, vehiclesApi, dispatchApi } from '@/lib/api';

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export function AssignDriverModal({ isOpen, onClose, booking, onSuccess }: AssignDriverModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAvailable();
    }
  }, [isOpen]);

  const fetchAvailable = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [dRes, vRes] = await Promise.all([
        driversApi.getAvailable(),
        vehiclesApi.getAvailable(),
      ]);
      setDrivers(Array.isArray(dRes.data) ? dRes.data : (dRes.data?.data || []));
      setVehicles(Array.isArray(vRes.data) ? vRes.data : (vRes.data?.data || []));
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to load available drivers and vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId || !selectedVehicleId) {
      setErrorMsg('Please select both a driver and a vehicle.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (booking.assignedDriverId) {
        await dispatchApi.changeDriver({
          bookingId: booking.id,
          newDriverId: selectedDriverId,
          newVehicleId: selectedVehicleId,
          note,
        });
      } else {
        await dispatchApi.assignDriver({
          bookingId: booking.id,
          driverId: selectedDriverId,
          vehicleId: selectedVehicleId,
          note,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to assign driver/vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in-0">
      <div className="relative w-full max-w-xl rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl text-zinc-100">
        
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">
              {booking.assignedDriverId ? 'Change Driver / Vehicle' : 'Assign Driver'}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Booking: <span className="text-red-400 font-mono">{booking.bookingNumber}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-3">
            <Loader2 size={32} className="animate-spin text-red-600" />
            <span className="text-sm font-medium">Loading available fleet...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                <User size={16} className="text-red-500" /> Select Driver
              </label>
              <div className="grid gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {drivers.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No drivers available.</p>
                ) : (
                  drivers.map((driver) => (
                    <div
                      key={driver.id}
                      onClick={() => setSelectedDriverId(driver.id)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                        selectedDriverId === driver.id 
                          ? 'bg-red-600/10 border-red-600 text-red-100' 
                          : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-sm">{driver.name}</p>
                        <p className="text-[11px] text-zinc-500">{driver.phone} • DL: {driver.licenseNo}</p>
                      </div>
                      {selectedDriverId === driver.id && <Check size={16} className="text-red-500" />}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                <Car size={16} className="text-red-500" /> Select Vehicle
              </label>
              <div className="grid gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {vehicles.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No vehicles available.</p>
                ) : (
                  vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicleId(vehicle.id)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                        selectedVehicleId === vehicle.id 
                          ? 'bg-red-600/10 border-red-600 text-red-100' 
                          : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-sm">{vehicle.make} {vehicle.model}</p>
                        <p className="text-[11px] text-zinc-500">{vehicle.plateNumber}</p>
                      </div>
                      {selectedVehicleId === vehicle.id && <Check size={16} className="text-red-500" />}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-300">Dispatch Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any specific instructions for the driver or customer..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-red-600 transition-all min-h-[80px]"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedDriverId || !selectedVehicleId}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Confirm Dispatch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
