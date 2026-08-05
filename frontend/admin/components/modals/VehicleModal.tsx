"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { vehiclesApi, driversApi } from '@/lib/api';
import { X, Loader2, Save } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

const PLATE_REGEX = /^([A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}|[0-9]{2}[ -]?BH[ -]?[0-9]{4}[ -]?[A-Z]{1,2})$/i;

const vehicleSchema = z.object({
  plateNumber: z.string().regex(PLATE_REGEX, "Invalid format. Use MP-09-AB-1234 or 21-BH-1234-AA"),
  make: z.string().min(2, "Make is required"),
  model: z.string().min(2, "Model is required"),
  year: z.number().min(2000).max(new Date().getFullYear() + 1),
  categoryId: z.string().min(1, "Category is required"),
  seatingCapacity: z.number().min(1).max(60),
  luggageCapacity: z.number().min(0).max(20),
  status: z.string(),
  driverId: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: any;
}

export function VehicleModal({ isOpen, onClose, vehicle }: VehicleModalProps) {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<any[]>([]);

  const { data: driversData } = useQuery({
    queryKey: ['available-drivers'],
    queryFn: () => driversApi.getAvailable(),
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch categories, usually via pricingApi or public-categories
      api.get('/pricing/public-categories').then(res => {
        if (res.data?.success && res.data?.data) {
          setCategories(Array.isArray(res.data.data) ? res.data.data : (res.data.data.data || []));
        }
      }).catch(err => console.error("Failed to load categories", err));
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      categoryId: '',
      seatingCapacity: 4,
      luggageCapacity: 2,
      status: 'ACTIVE',
      driverId: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        reset({
          plateNumber: vehicle.plateNumber || '',
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          categoryId: vehicle.categoryId || '',
          seatingCapacity: vehicle.seatingCapacity || 4,
          luggageCapacity: vehicle.luggageCapacity || 2,
          status: vehicle.status || 'ACTIVE',
          driverId: vehicle.driverId || '',
        });
      } else {
        reset({
          plateNumber: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          categoryId: '',
          seatingCapacity: 4,
          luggageCapacity: 2,
          status: 'ACTIVE',
          driverId: '',
        });
      }
    }
  }, [isOpen, vehicle, reset]);

  const mutation = useMutation({
    mutationFn: (data: VehicleFormValues) => {
      // API expects driverId to be null if empty
      const payload = { ...data, driverId: data.driverId || null };
      if (vehicle?.id) {
        return vehiclesApi.update(vehicle.id, payload);
      }
      return vehiclesApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      onClose();
    },
    onError: (error) => {
      console.error('Failed to save vehicle', error);
      alert('Failed to save vehicle. Please try again.');
    },
  });

  if (!isOpen) return null;

  const driversList = Array.isArray(driversData?.data) ? driversData.data : (driversData?.data?.data || []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div className="w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-white">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="vehicle-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Plate Number *</label>
                <input
                  {...register('plateNumber')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all uppercase"
                  placeholder="e.g. MP09-AB-1234"
                />
                {errors.plateNumber && <p className="mt-1 text-xs text-red-500">{errors.plateNumber.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Category *</label>
                <select
                  {...register('categoryId')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.categoryId || c.id} value={c.categoryId || c.id}>{c.categoryName || c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Make *</label>
                <input
                  {...register('make')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                  placeholder="e.g. Maruti"
                />
                {errors.make && <p className="mt-1 text-xs text-red-500">{errors.make.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Model *</label>
                <input
                  {...register('model')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                  placeholder="e.g. Dzire"
                />
                {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Year *</label>
                <input
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
                {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Seating Capacity</label>
                <input
                  type="number"
                  {...register('seatingCapacity', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Luggage Capacity (Bags)</label>
                <input
                  type="number"
                  {...register('luggageCapacity', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Assign Driver (Optional)</label>
                <select
                  {...register('driverId')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                >
                  <option value="">Unassigned</option>
                  {driversList.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.licenseNo})</option>
                  ))}
                  {vehicle?.driver && !driversList.some((d: any) => d.id === vehicle.driver.id) && (
                    <option value={vehicle.driver.id}>{vehicle.driver.name} (Current)</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
                <select
                  {...register('status')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 shrink-0 bg-zinc-950/50">
          <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="vehicle-form" disabled={mutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50">
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{vehicle ? 'Update Vehicle' : 'Save Vehicle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
