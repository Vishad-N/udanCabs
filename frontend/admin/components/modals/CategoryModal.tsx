"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { pricingApi } from '@/lib/api';
import { X, Loader2, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: '', description: '' });
    }
  }, [isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (data: CategoryFormValues) => {
      return pricingApi.createCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-categories'] });
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to create category', error);
      alert(error?.response?.data?.message || 'Failed to create category.');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0">
      <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <h2 className="text-xl font-bold text-white">Add New Category</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6">
          <form id="category-form" onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Category Name *</label>
              <input
                {...register('name')}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all"
                placeholder="e.g. Premium Sedan"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 transition-all resize-none"
                placeholder="e.g. Comfortable rides for small families."
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 shrink-0 bg-zinc-950/50">
          <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button type="submit" form="category-form" disabled={mutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50">
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Create</span>
          </button>
        </div>
      </div>
    </div>
  );
}
