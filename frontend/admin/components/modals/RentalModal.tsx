"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { rentalApi } from '@/lib/api';
import { X, Loader2, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const PLATE_REGEX = /^([A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}|[0-9]{2}[ -]?BH[ -]?[0-9]{4}[ -]?[A-Z]{1,2})$/i;

const rentalSchema = z.object({
  brand: z.string().min(2, "Brand is required"),
  make: z.string().min(2, "Make is required"),
  model: z.string().min(2, "Model is required"),
  plateNumber: z.string().regex(PLATE_REGEX, "Invalid format. Use MP-09-AB-1234 or 21-BH-1234-AA"),
  dailyRate: z.number().min(0),
  status: z.string().default("AVAILABLE"),
});

type RentalFormValues = z.infer<typeof rentalSchema>;

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  rental?: any;
}

export function RentalModal({ isOpen, onClose, rental }: RentalModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      brand: '',
      make: '',
      model: '',
      plateNumber: '',
      dailyRate: 0,
      status: 'AVAILABLE',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (rental) {
        reset({
          brand: rental.brand || '',
          make: rental.make || '',
          model: rental.model || '',
          plateNumber: rental.plateNumber || '',
          dailyRate: rental.dailyRate || 0,
          status: rental.status || 'AVAILABLE',
        });
      } else {
        reset({
          brand: '',
          make: '',
          model: '',
          plateNumber: '',
          dailyRate: 0,
          status: 'AVAILABLE',
        });
      }
    }
  }, [isOpen, rental, reset]);

  const mutation = useMutation({
    mutationFn: (data: RentalFormValues) => {
      if (rental?.id) {
        return rentalApi.update(rental.id, data);
      }
      return rentalApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      onClose();
    },
    onError: (error) => {
      console.error('Failed to save rental', error);
      alert('Failed to save rental. Please try again.');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-white">
            {rental ? 'Edit Rental Bike' : 'Add Rental Bike'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="rental-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Brand *</label>
                <input
                  {...register('brand')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                  placeholder="e.g. Honda"
                />
                {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Make *</label>
                <input
                  {...register('make')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                  placeholder="e.g. Honda"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Model *</label>
                <input
                  {...register('model')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                  placeholder="e.g. Activa 6G"
                />
                {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Plate Number *</label>
                <input
                  {...register('plateNumber')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all uppercase"
                  placeholder="e.g. MP09-RX-9999"
                />
                {errors.plateNumber && <p className="mt-1 text-xs text-red-500">{errors.plateNumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Daily Rate (₹) *</label>
                <input
                  type="number"
                  {...register('dailyRate', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
                <select
                  {...register('status')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="RENTED">Rented</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 shrink-0 bg-zinc-950/50">
          <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="rental-form" disabled={mutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50">
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{rental ? 'Update Rental' : 'Save Rental'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
