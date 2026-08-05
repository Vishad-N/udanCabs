"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '@/lib/api';
import { Plus, Search, Loader2, Edit, Trash2 } from 'lucide-react';
import { DriverModal } from '@/components/modals/DriverModal';

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => driversApi.getAll(),
  });

  const drivers = Array.isArray(data?.data) ? data.data : (data?.data?.data || []);

  const filteredDrivers = drivers.filter((driver: any) =>
    driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.includes(searchTerm) ||
    driver.licenseNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (driver: any) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      try {
        await driversApi.delete(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete driver', err);
        alert('Failed to delete driver');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Drivers Management</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your fleet drivers and their statuses</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
        >
          <Plus size={18} />
          <span>Add Driver</span>
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-4 border-b border-zinc-800/80 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, phone or license..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs text-zinc-500 bg-zinc-950/50 uppercase border-b border-zinc-800/80">
              <tr>
                <th className="px-6 py-4 font-bold">Driver Info</th>
                <th className="px-6 py-4 font-bold">License No</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
                    <p>Loading drivers...</p>
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-300 font-medium text-lg">No drivers found</p>
                    <p className="text-zinc-500 mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver: any) => (
                  <tr key={driver.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold">
                          {driver.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-200">{driver.name}</div>
                          <div className="text-xs text-zinc-500">{driver.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{driver.licenseNo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        driver.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        driver.status === 'ON_TRIP' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(driver)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(driver.id)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        driver={selectedDriver}
      />
    </div>
  );
}
