"use client";

import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { tourApi } from '@/lib/api';
import { X, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const tourSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description is required"),
  durationDays: z.number().min(1),
  duration: z.string().min(2),
  price: z.number().min(0),
  status: z.string(),
  carOptions: z.array(z.object({
    name: z.string().min(1, "Car name is required"),
    price: z.number().min(0, "Price must be at least 0"),
    maxPassengers: z.number().min(1, "Must have at least 1 passenger"),
  })).optional(),
});

type TourFormValues = z.infer<typeof tourSchema>;

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour?: any;
}

export function TourModal({ isOpen, onClose, tour }: TourModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: '',
      description: '',
      durationDays: 1,
      duration: '1 Day',
      price: 0,
      status: 'ACTIVE',
      carOptions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "carOptions",
  });

  useEffect(() => {
    if (isOpen) {
      if (tour) {
        reset({
          name: tour.name || '',
          description: tour.description || '',
          durationDays: tour.durationDays || 1,
          duration: tour.duration || '',
          price: tour.price || 0,
          status: tour.status || 'ACTIVE',
          carOptions: tour.carOptions ? (typeof tour.carOptions === 'string' ? JSON.parse(tour.carOptions) : tour.carOptions) : [],
        });
      } else {
        reset({
          name: '',
          description: '',
          durationDays: 1,
          duration: '1 Day',
          price: 0,
          status: 'ACTIVE',
          carOptions: [],
        });
      }
    }
  }, [isOpen, tour, reset]);

  const mutation = useMutation({
    mutationFn: (data: TourFormValues) => {
      if (tour?.id) {
        return tourApi.update(tour.id, data);
      }
      return tourApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      onClose();
    },
    onError: (error) => {
      console.error('Failed to save tour', error);
      alert('Failed to save tour. Please try again.');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-white">
            {tour ? 'Edit Tour Package' : 'Add Tour Package'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="tour-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Package Name *</label>
              <input
                {...register('name')}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                placeholder="e.g. Omkareshwar Darshan"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Duration Days *</label>
                <input
                  type="number"
                  {...register('durationDays', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Duration Text *</label>
                <input
                  {...register('duration')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                  placeholder="e.g. 1 Day / 0 Nights"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Base Price (₹) *</label>
                <input
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
                <select
                  {...register('status')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-white">Car Options & Fares</label>
                <button
                  type="button"
                  onClick={() => append({ name: '', price: 0, maxPassengers: 4 })}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add Car Option
                </button>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        {...register(`carOptions.${index}.name` as const)}
                        placeholder="Car Name (e.g. Dzire)"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                      />
                      {errors.carOptions?.[index]?.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.carOptions[index].name?.message}</p>
                      )}
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        {...register(`carOptions.${index}.price` as const, { valueAsNumber: true })}
                        placeholder="Fare (₹)"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                      />
                      {errors.carOptions?.[index]?.price && (
                        <p className="mt-1 text-xs text-red-500">{errors.carOptions[index].price?.message}</p>
                      )}
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        {...register(`carOptions.${index}.maxPassengers` as const, { valueAsNumber: true })}
                        placeholder="Max Pax"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                      />
                      {errors.carOptions?.[index]?.maxPassengers && (
                        <p className="mt-1 text-xs text-red-500">{errors.carOptions[index].maxPassengers?.message}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-0.5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-4 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
                    No car options added. Only base price will be available.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-zinc-400 mb-1">Description *</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all resize-none"
                placeholder="Package details..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 shrink-0 bg-zinc-950/50">
          <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="tour-form" disabled={mutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50">
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{tour ? 'Update Tour' : 'Save Tour'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
