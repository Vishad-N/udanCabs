"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '@/lib/api';
import { Plus, Search, Loader2, Edit, Trash2 } from 'lucide-react';
import { VehicleModal } from '@/components/modals/VehicleModal';

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehiclesApi.getAll(),
  });

  const vehicles = Array.isArray(data?.data) ? data.data : (data?.data?.data || []);

  const filteredVehicles = vehicles.filter((vehicle: any) =>
    vehicle.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehiclesApi.delete(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete vehicle', err);
        alert('Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Fleet Vehicles</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your cars, categories, and assignments</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
        >
          <Plus size={18} />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-4 border-b border-zinc-800/80 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search by plate, make, model..."
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
                <th className="px-6 py-4 font-bold">Vehicle Info</th>
                <th className="px-6 py-4 font-bold">Plate Number</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
                    <p>Loading vehicles...</p>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-300 font-medium text-lg">No vehicles found</p>
                    <p className="text-zinc-500 mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle: any) => (
                  <tr key={vehicle.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-200">{vehicle.make} {vehicle.model}</div>
                      <div className="text-xs text-zinc-500">{vehicle.year} &middot; {vehicle.seatingCapacity} Seats</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs uppercase">{vehicle.plateNumber}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{vehicle.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        vehicle.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        vehicle.status === 'MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
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

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
      />
    </div>
  );
}
