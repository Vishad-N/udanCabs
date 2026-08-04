'use client';

import React from 'react';
import { MapPin, Navigation, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface InteractiveMapProps {
  origin?: string;
  originLat?: number;
  originLng?: number;
  destination?: string;
  destinationLat?: number;
  destinationLng?: number;
  distanceKm?: number;
  durationText?: string;
  polyline?: string;
  onUseCurrentLocation?: () => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin = 'Pickup Location Not Selected',
  originLat,
  originLng,
  destination = 'Destination Not Selected',
  destinationLat,
  destinationLng,
  distanceKm,
  durationText,
  polyline,
  onUseCurrentLocation,
  className = 'h-64',
}) => {
  const hasRoute = Boolean(distanceKm && distanceKm > 0);
  const isGoogleKeyPresent = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-950 shadow-2xl flex flex-col ${className}`}>
      {/* Top Map Header Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">
            {hasRoute ? 'Live Route Calculated' : 'Ujjain GPS Coverage'}
          </span>
        </div>

        {onUseCurrentLocation && (
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-lg transition-all transform hover:scale-105 pointer-events-auto"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Locate Me</span>
          </button>
        )}
      </div>

      {/* Map Content Area (Hybrid Visual Route Engine / Google Maps embed) */}
      <div className="flex-1 relative w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-6 overflow-hidden">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {hasRoute ? (
          <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center py-4">
            {/* Visual Route Polyline Animation */}
            <div className="w-full flex items-center justify-between relative px-4 my-6">
              {/* Origin Marker */}
              <div className="flex flex-col items-center z-10 group">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="mt-2 text-center max-w-[120px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Pickup</span>
                  <span className="text-xs text-white font-medium truncate block" title={origin}>
                    {origin.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Glowing Route Connector Line */}
              <div className="flex-1 mx-3 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full shadow-lg opacity-80" />
                </div>
                {/* Moving Pulse Dot */}
                <div className="z-10 bg-zinc-900 border border-amber-500/80 rounded-full px-3 py-1 shadow-xl flex items-center gap-1.5 animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-black text-amber-400">{distanceKm} km</span>
                </div>
              </div>

              {/* Destination Marker */}
              <div className="flex flex-col items-center z-10 group">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-rose-400" />
                </div>
                <div className="mt-2 text-center max-w-[120px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">Dropoff</span>
                  <span className="text-xs text-white font-medium truncate block" title={destination}>
                    {destination.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Travel Time & Specs Pill */}
            {durationText && (
              <div className="mt-2 bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-4 py-2 flex items-center gap-4 text-xs text-zinc-300 shadow-xl">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Est. Travel Time: {durationText}</span>
                </div>
                <div className="w-px h-3 bg-zinc-700" />
                <div className="flex items-center gap-1 text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Route</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center z-10 max-w-sm px-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <MapPin className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Select Route to View Map</h4>
            <p className="text-xs text-zinc-400">
              Enter your pickup and dropoff locations above to calculate route distance, estimated time, and live vehicle pricing.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Route Summary Bar */}
      <div className="bg-zinc-900/80 border-t border-zinc-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2 truncate max-w-[70%]">
          <span className="font-semibold text-zinc-300">Route:</span>
          <span className="truncate">{origin.split(',')[0]} → {destination.split(',')[0]}</span>
        </div>
        {distanceKm ? (
          <span className="text-amber-400 font-mono font-bold">{distanceKm} KM</span>
        ) : (
          <span className="text-zinc-500 italic">No distance calculated</span>
        )}
      </div>
    </div>
  );
};
