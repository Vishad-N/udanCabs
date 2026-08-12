"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { pricingApi } from '@/lib/api';
import { X, Loader2, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const pricingSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z.number().min(0),
  includedKm: z.number().min(0),
  pricePerKm: z.number().min(0),
  minFare: z.number().min(0),
  waitingCharge: z.number().min(0),
  nightCharge: z.number().min(0),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricing?: any; // existing pricing rule if editing
  categoryId: string; // The category this pricing belongs to
}

export function PricingModal({ isOpen, onClose, pricing, categoryId }: PricingModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      categoryId: categoryId || '',
      basePrice: 0,
      includedKm: 0,
      pricePerKm: 0,
      minFare: 0,
      waitingCharge: 0,
      nightCharge: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (pricing) {
        reset({
          categoryId: pricing.categoryId || categoryId,
          basePrice: pricing.basePrice || 0,
          includedKm: pricing.includedKm || 0,
          pricePerKm: pricing.pricePerKm || 0,
          minFare: pricing.minFare || 0,
          waitingCharge: pricing.waitingCharge || 0,
          nightCharge: pricing.nightCharge || 0,
        });
      } else {
        reset({
          categoryId: categoryId,
          basePrice: 0,
          includedKm: 0,
          pricePerKm: 0,
          minFare: 0,
          waitingCharge: 0,
          nightCharge: 0,
        });
      }
    }
  }, [isOpen, pricing, categoryId, reset]);

  const mutation = useMutation({
    mutationFn: (data: PricingFormValues) => {
      if (pricing?.id) {
        return pricingApi.update(pricing.id, data);
      }
      return pricingApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-categories'] });
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to save pricing', error);
      alert(error?.response?.data?.message || 'Failed to save pricing.');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div className="w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-white">
            {pricing ? 'Edit Pricing Rule' : 'Set Pricing Rule'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="pricing-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <input type="hidden" {...register('categoryId')} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Base Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('basePrice', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
                {errors.basePrice && <p className="mt-1 text-xs text-red-500">{errors.basePrice.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Included KM *</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('includedKm', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
                <p className="text-[10px] text-zinc-500 mt-1">KM included in the base price</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Price Per KM (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('pricePerKm', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
                {errors.pricePerKm && <p className="mt-1 text-xs text-red-500">{errors.pricePerKm.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Minimum Fare (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('minFare', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Waiting Charge (₹/hr)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('waitingCharge', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Night Charge (₹ or %)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('nightCharge', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
                <p className="text-[10px] text-zinc-500 mt-1">If {"<=50"}, treated as %. Otherwise flat ₹.</p>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 shrink-0 bg-zinc-950/50">
          <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="pricing-form" disabled={mutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50">
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{pricing ? 'Update' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
