"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { driversApi } from '@/lib/api';
import { X, Loader2, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const driverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  licenseNo: z.string().min(10, "Valid license number required"),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
  status: z.string(),
});

type DriverFormValues = z.infer<typeof driverSchema>;

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver?: any; // null if creating
}

export function DriverModal({ isOpen, onClose, driver }: DriverModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: '',
      phone: '',
      licenseNo: '',
      emergencyContact: '',
      address: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (driver) {
        reset({
          name: driver.name || '',
          phone: driver.phone || '',
          licenseNo: driver.licenseNo || '',
          emergencyContact: driver.emergencyContact || '',
          address: driver.address || '',
          status: driver.status || 'ACTIVE',
        });
      } else {
        reset({
          name: '',
          phone: '',
          licenseNo: '',
          emergencyContact: '',
          address: '',
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, driver, reset]);

  const mutation = useMutation({
    mutationFn: (data: DriverFormValues) => {
      if (driver?.id) {
        return driversApi.update(driver.id, data);
      }
      return driversApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      onClose();
    },
    onError: (error) => {
      console.error('Failed to save driver', error);
      alert('Failed to save driver. Please try again.');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-white">
            {driver ? 'Edit Driver' : 'Add New Driver'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="driver-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Full Name *</label>
              <input
                {...register('name')}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder="e.g. Ramesh Kumar"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  maxLength={10}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                  }}
                  {...register('phone')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  placeholder="e.g. 9876543210"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">License No. *</label>
                <input
                  {...register('licenseNo')}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all uppercase"
                  placeholder="e.g. MP09-2015-1234"
                />
                {errors.licenseNo && <p className="mt-1 text-xs text-red-500">{errors.licenseNo.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Emergency Contact</label>
              <input
                type="tel"
                maxLength={10}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                }}
                {...register('emergencyContact')}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder="e.g. 9876543211"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Address</label>
              <textarea
                {...register('address')}
                rows={2}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
                placeholder="e.g. 123, Mahakal Road, Ujjain"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_TRIP">On Trip</option>
              </select>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 shrink-0 bg-zinc-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="driver-form"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{driver ? 'Update Driver' : 'Save Driver'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
