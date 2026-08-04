'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2, X, Search } from 'lucide-react';
import { mapsApi } from '../../lib/api';

export interface LocationValue {
  address: string;
  lat?: number;
  lng?: number;
}

interface LocationAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelectLocation?: (location: LocationValue) => void;
  showCurrentLocation?: boolean;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  placeholder = 'Enter location or landmark',
  value,
  onChange,
  onSelectLocation,
  showCurrentLocation = true,
  className = '',
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced autocomplete search
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await mapsApi.autocomplete(value);
        if (res?.success && Array.isArray(res.data)) {
          setSuggestions(res.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = async (sug: any) => {
    onChange(sug.description);
    setIsOpen(false);

    if (onSelectLocation) {
      if (sug.lat !== undefined && sug.lng !== undefined) {
        onSelectLocation({
          address: sug.description,
          lat: sug.lat,
          lng: sug.lng,
        });
      } else {
        try {
          const res = await mapsApi.geocode({ address: sug.description });
          if (res?.success && res.data) {
            onSelectLocation({
              address: res.data.address || sug.description,
              lat: res.data.lat,
              lng: res.data.lng,
            });
          }
        } catch (err) {
          console.error('Geocoding error:', err);
          onSelectLocation({ address: sug.description });
        }
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await mapsApi.geocode({ lat: latitude, lng: longitude });
          if (res?.success && res.data) {
            const addr = res.data.address;
            onChange(addr);
            if (onSelectLocation) {
              onSelectLocation({ address: addr, lat: latitude, lng: longitude });
            }
          } else {
            const addr = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
            onChange(addr);
            if (onSelectLocation) {
              onSelectLocation({ address: addr, lat: latitude, lng: longitude });
            }
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          const addr = `Current Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
          onChange(addr);
          if (onSelectLocation) {
            onSelectLocation({ address: addr, lat: latitude, lng: longitude });
          }
        } finally {
          setGeoLoading(false);
          setIsOpen(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Could not get your location. Please check browser permissions.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {label && <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">{label}</label>}
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-amber-500 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
        />
        <div className="absolute right-3 flex items-center gap-1">
          {loading && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />}
          {value && !loading && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setSuggestions([]);
              }}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {(isOpen && (suggestions.length > 0 || showCurrentLocation)) && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-zinc-800/80">
          {showCurrentLocation && (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="w-full px-4 py-3 flex items-center gap-3 text-left bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition-colors"
            >
              {geoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              ) : (
                <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{geoLoading ? 'Detecting your GPS coordinates...' : 'Use Current GPS Location'}</span>
            </button>
          )}

          {suggestions.map((sug, idx) => (
            <button
              key={sug.placeId || idx}
              type="button"
              onClick={() => handleSelect(sug)}
              className="w-full px-4 py-2.5 flex items-start gap-3 text-left hover:bg-zinc-800/70 transition-colors group"
            >
              <MapPin className="w-4 h-4 text-zinc-500 group-hover:text-amber-500 shrink-0 mt-0.5 transition-colors" />
              <span className="text-xs text-zinc-300 group-hover:text-white line-clamp-2">{sug.description}</span>
            </button>
          ))}

          {suggestions.length === 0 && !loading && value.trim().length >= 2 && (
            <div className="px-4 py-3 text-xs text-zinc-500 text-center">No location suggestions found</div>
          )}
        </div>
      )}
    </div>
  );
};
