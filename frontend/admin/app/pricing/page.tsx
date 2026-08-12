"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pricingApi } from '@/lib/api';
import { Plus, Settings2, Edit } from 'lucide-react';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { PricingModal } from '@/components/modals/PricingModal';

export default function PricingPage() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedPricing, setSelectedPricing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['pricing-categories'],
    queryFn: () => pricingApi.getCategories(),
  });

  const categories = Array.isArray(data?.data) ? data.data : (data?.data?.data || []);

  const handleSetPricing = (category: any) => {
    setSelectedCategory(category);
    setSelectedPricing(category.pricing || null);
    setIsPricingModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Pricing & Fares</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage base fares, per KM rates, and categories for your fleet</p>
        </div>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
            <p className="text-lg font-medium text-zinc-300">No categories found</p>
            <p className="mt-1">Add a new vehicle category to set up pricing.</p>
          </div>
        ) : (
          categories.map((category: any) => (
            <div key={category.id} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-xl hover:border-red-500/30 transition-colors group">
              <div className="p-6 border-b border-zinc-800/80">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{category.name}</h3>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${category.pricing ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {category.pricing ? 'Configured' : 'Missing Rates'}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2 min-h-[40px]">
                  {category.description || 'No description provided.'}
                </p>
              </div>

              <div className="p-6 bg-zinc-950/50">
                {category.pricing ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Per KM Rate</p>
                        <p className="text-2xl font-black text-white">₹{category.pricing.pricePerKm}<span className="text-sm font-medium text-zinc-500">/km</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Base Fare</p>
                        <p className="text-lg font-bold text-zinc-200">₹{category.pricing.basePrice}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-800/50 flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400">
                        Inc. {category.pricing.includedKm} KM
                      </span>
                      <span className="text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400">
                        Min ₹{category.pricing.minFare}
                      </span>
                      {category.pricing.nightCharge > 0 && (
                        <span className="text-xs px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md">
                          Night Charge
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-zinc-500 mb-4">No pricing rules configured for this category.</p>
                  </div>
                )}

                <button
                  onClick={() => handleSetPricing(category)}
                  className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800/50 text-sm font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  {category.pricing ? (
                    <><Edit size={16} /> Edit Pricing</>
                  ) : (
                    <><Settings2 size={16} /> Set Pricing Rules</>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        pricing={selectedPricing}
        categoryId={selectedCategory?.id || ''}
      />
    </div>
  );
}
