'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  X,
  Car,
  Plane,
  MapPin,
  Bike,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Users,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { bookingApi, mapsApi, pricingApi, tourApi } from '@/lib/api';
import { InteractiveMap } from '@/components/ui/InteractiveMap';
import { LocationAutocomplete, LocationValue } from '@/components/inputs/LocationAutocomplete';
import { ScheduleSelector } from '@/components/inputs/ScheduleSelector';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  pickupDate: z.string().min(1, 'Travel date is required'),
  pickupTime: z.string().min(1, 'Travel time is required'),
  passengers: z.number().min(1).max(20).optional(),
  passengerNames: z.array(z.string()).optional(),
  flightNumber: z.string().optional(),
  rentalDuration: z.string().optional(),
  licenseNumber: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  initialData?: {
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupLat?: number;
    pickupLng?: number;
    dropoffLat?: number;
    dropoffLng?: number;
    pickupDate?: string;
    pickupTime?: string;
  };
  onSuccess: (booking: any) => void;
}

export function BookingModal({ isOpen, onClose, initialTab = 'Cab', initialData, onSuccess }: BookingModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Route & Map State
  const [pickupAddr, setPickupAddr] = useState(initialData?.pickupLocation || '');
  const [pickupLat, setPickupLat] = useState<number | undefined>(initialData?.pickupLat);
  const [pickupLng, setPickupLng] = useState<number | undefined>(initialData?.pickupLng);

  const [dropoffAddr, setDropoffAddr] = useState(initialData?.dropoffLocation || '');
  const [dropoffLat, setDropoffLat] = useState<number | undefined>(initialData?.dropoffLat);
  const [dropoffLng, setDropoffLng] = useState<number | undefined>(initialData?.dropoffLng);

  const [routeLoading, setRouteLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationText: string;
    durationMinutes: number;
    polyline?: string;
  } | null>(null);

  // Pricing State
  const [pricingLoading, setPricingLoading] = useState(false);
  const [fareEstimates, setFareEstimates] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  // Tour State
  const [tourPackages, setTourPackages] = useState<any[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [selectedTourPackage, setSelectedTourPackage] = useState<any>(null);
  const [selectedTourCar, setSelectedTourCar] = useState<any>(null);

  // Schedule State
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTimeStr, setScheduledTimeStr] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      pickupDate: initialData?.pickupDate || new Date().toISOString().split('T')[0],
      pickupTime: initialData?.pickupTime || '10:00 AM',
      passengers: 4,
      passengerNames: [],
      flightNumber: '',
      rentalDuration: '1 Day',
      licenseNumber: '',
      notes: '',
    },
  });

  const watchPickupTime = watch('pickupTime');
  const watchPassengers = watch('passengers');

  // Sync initial tab & data when opened
  useEffect(() => {
    if (isOpen) {
      if (initialTab) setActiveTab(initialTab);
      if (initialData?.pickupLocation) setPickupAddr(initialData.pickupLocation);
      if (initialData?.dropoffLocation) setDropoffAddr(initialData.dropoffLocation);
      if (initialData?.pickupLat) setPickupLat(initialData.pickupLat);
      if (initialData?.pickupLng) setPickupLng(initialData.pickupLng);
      if (initialData?.dropoffLat) setDropoffLat(initialData.dropoffLat);
      if (initialData?.dropoffLng) setDropoffLng(initialData.dropoffLng);
      setStep(1);
    }
  }, [isOpen, initialTab, initialData]);

  // Fetch tour packages
  useEffect(() => {
    if (isOpen && activeTab === 'Tours') {
      const fetchTours = async () => {
        setToursLoading(true);
        try {
          const res = await tourApi.getPublic();
          if (Array.isArray(res.data)) {
            setTourPackages(res.data);
          } else if (res.data && Array.isArray(res.data.data)) {
            setTourPackages(res.data.data);
          } else {
            setTourPackages([]);
          }
        } catch (err) {
          console.error('Failed to fetch tours:', err);
        } finally {
          setToursLoading(false);
        }
      };
      fetchTours();
    }
  }, [isOpen, activeTab]);

  // Automatically calculate route when pickup and dropoff change
  useEffect(() => {
    if (activeTab === 'Rental') {
      setRouteInfo({ distanceKm: 0, durationText: '24 Hours', durationMinutes: 1440 });
      return;
    }

    if (pickupAddr && dropoffAddr && pickupAddr.length >= 3 && dropoffAddr.length >= 3) {
      const fetchRoute = async () => {
        setRouteLoading(true);
        try {
          const res = await mapsApi.calculateRoute(pickupAddr, dropoffAddr);
          if (res?.success && res.data) {
            setRouteInfo({
              distanceKm: res.data.distanceKm,
              durationText: res.data.durationText,
              durationMinutes: res.data.durationMinutes,
              polyline: res.data.polyline,
            });
            if (res.data.originLat) setPickupLat(res.data.originLat);
            if (res.data.originLng) setPickupLng(res.data.originLng);
            if (res.data.destinationLat) setDropoffLat(res.data.destinationLat);
            if (res.data.destinationLng) setDropoffLng(res.data.destinationLng);
          }
        } catch (err) {
          console.error('Route calculation failed:', err);
        } finally {
          setRouteLoading(false);
        }
      };
      fetchRoute();
    } else {
      setRouteInfo(null);
    }
  }, [pickupAddr, dropoffAddr, activeTab]);

  // Fetch fare estimates when stepping to Step 2
  const fetchEstimates = async () => {
    setPricingLoading(true);
    setErrorMsg(null);
    try {
      const dist = routeInfo?.distanceKm || (activeTab === 'Rental' ? 50 : 15);
      const res = await pricingApi.estimate({
        distance: dist,
        duration: routeInfo?.durationMinutes || 30,
        pickupTime: watchPickupTime,
      });
      if (res?.success && Array.isArray(res.data)) {
        setFareEstimates(res.data);
        if (!selectedVehicle && res.data.length > 0) {
          setSelectedVehicle(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Fare estimation error:', err);
      setErrorMsg('Could not fetch vehicle rates. Please try again.');
    } finally {
      setPricingLoading(false);
    }
  };

  if (!isOpen) return null;

  const getBookingTypeEnum = (tab: string) => {
    switch (tab) {
      case 'Airport': return 'AIRPORT_TRANSFER';
      case 'Tours': return 'TOUR';
      case 'Rental': return 'RENTAL';
      case 'Cab':
      default: return 'CAB';
    }
  };

  const handleNextToVehicles = () => {
    if (activeTab === 'Tours') {
      if (!selectedTourPackage) {
        setErrorMsg('Please select a tour package to continue.');
        return;
      }
      setErrorMsg(null);
      setStep(3); // skip step 2 for tours
      return;
    }
    
    if (!pickupAddr || (!dropoffAddr && activeTab !== 'Rental')) {
      setErrorMsg('Please select both pickup and destination locations.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
    fetchEstimates();
  };

  const handleNextToPassenger = () => {
    if (!selectedVehicle && activeTab !== 'Rental') {
      setErrorMsg('Please select a vehicle category.');
      return;
    }
    setErrorMsg(null);
    setStep(3);
  };

  const handleNextToReview = async () => {
    // Validate form fields before going to review screen
    handleSubmit(() => {
      setErrorMsg(null);
      setStep(4);
    })();
  };

  const onFinalSubmit = async (data: BookingFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const fare = activeTab === 'Rental' ? 800 : (activeTab === 'Tours' ? (selectedTourCar ? selectedTourCar.price : (selectedTourPackage?.basePrice || selectedTourPackage?.price)) : selectedVehicle?.estimatedFare || 1200);
      let finalScheduledPickupAt: string | undefined = undefined;
      if (isScheduled && scheduledDate && scheduledTimeStr) {
        const [timePart, ampm] = scheduledTimeStr.split(' ');
        const [hourStr, minStr] = timePart.split(':');
        let hours = parseInt(hourStr, 10);
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        const finalDate = new Date(scheduledDate);
        finalDate.setHours(hours, parseInt(minStr, 10), 0, 0);
        finalScheduledPickupAt = finalDate.toISOString();
      }

      const payload = {
        ...data,
        customerName: activeTab === 'Tours' ? (data.passengerNames?.[0] || 'Tour Booker') : data.customerName,
        passengerNames: activeTab === 'Tours' ? data.passengerNames : [],
        bookingType: getBookingTypeEnum(activeTab),
        pickupLocation: activeTab === 'Tours' ? 'Tour Starting Point' : pickupAddr,
        dropoffLocation: activeTab === 'Tours' ? selectedTourPackage?.name : (dropoffAddr || 'Rental Return Store'),
        vehicleCategory: activeTab === 'Tours' ? (selectedTourCar ? selectedTourCar.name : 'Standard') : (selectedVehicle?.categoryName || 'Sedan'),
        tourPackageId: activeTab === 'Tours' ? selectedTourPackage?.id : undefined,
        totalFare: fare,
        pickupAddress: activeTab === 'Tours' ? 'Tour Starting Point' : pickupAddr,
        pickupLatitude: pickupLat,
        pickupLongitude: pickupLng,
        destinationAddress: activeTab === 'Tours' ? selectedTourPackage?.name : dropoffAddr,
        destinationLatitude: dropoffLat,
        destinationLongitude: dropoffLng,
        distance: routeInfo?.distanceKm,
        estimatedDuration: routeInfo?.durationText,
        estimatedFare: fare,
        pricingSnapshot: selectedVehicle?.pricingSnapshot,
        routePolyline: routeInfo?.polyline,
        isScheduled,
        scheduledPickupAt: finalScheduledPickupAt,
      };

      const result = await bookingApi.create(payload);
      reset();
      onClose();
      onSuccess(result?.data || result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'Cab', label: 'City Cab', icon: Car },
    { id: 'Airport', label: 'Airport Transfer', icon: Plane },
    { id: 'Tours', label: 'Spiritual Tour', icon: MapPin },
    { id: 'Rental', label: 'Bike Rental', icon: Bike },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in-0">
      <div className="relative w-full max-w-3xl rounded-3xl bg-card border border-border/60 p-6 sm:p-8 shadow-2xl text-card-foreground my-8 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/20 text-primary uppercase tracking-wider">
                Step {step} of 4
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {step === 1 && 'Select Route & Locations'}
                {step === 2 && 'Choose Your Vehicle & Fare'}
                {step === 3 && 'Passenger & Travel Details'}
                {step === 4 && 'Review & Confirm Booking'}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {step === 1 && 'Interactive GPS route calculation across Ujjain & Indore'}
              {step === 2 && 'Transparent dynamic pricing based on distance & category'}
              {step === 3 && 'Provide contact details for instant confirmation & driver assignment'}
              {step === 4 && 'Verify trip route, vehicle rate card, and contact details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-secondary h-1.5 rounded-full my-4 overflow-hidden shrink-0">
          <div
            className="bg-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-destructive/15 border border-destructive/30 p-3.5 text-xs font-semibold text-destructive shrink-0">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Content Area */}
        <div className="flex-1 overflow-y-auto pt-2 pb-8 pr-1 space-y-6">
          {/* STEP 1: ROUTE & MAP */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-secondary/50 border border-border/40">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === 'Tours' ? null : (
                  <LocationAutocomplete
                    label={activeTab === 'Airport' ? 'Pickup Address in Ujjain / Indore' : 'Pickup Location *'}
                    placeholder="e.g. Mahakal Temple, Ujjain"
                    value={pickupAddr}
                    onChange={setPickupAddr}
                    onSelectLocation={(val: LocationValue) => {
                      setPickupAddr(val.address);
                      setPickupLat(val.lat);
                      setPickupLng(val.lng);
                    }}
                    showCurrentLocation={true}
                  />
                )}

                {activeTab === 'Rental' ? (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Rental Store</label>
                    <input
                      disabled
                      value="Udan Cabs Central Bike Station, Nanakheda, Ujjain"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-zinc-400 text-xs cursor-not-allowed"
                    />
                  </div>
                ) : activeTab === 'Tours' ? null : (
                  <LocationAutocomplete
                    label={activeTab === 'Airport' ? 'Airport Name / Terminal' : 'Dropoff Destination *'}
                    placeholder="e.g. Indore Airport or Omkareshwar"
                    value={dropoffAddr}
                    onChange={setDropoffAddr}
                    onSelectLocation={(val: LocationValue) => {
                      setDropoffAddr(val.address);
                      setDropoffLat(val.lat);
                      setDropoffLng(val.lng);
                    }}
                    showCurrentLocation={false}
                  />
                )}
              </div>

              {activeTab === 'Tours' ? (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/50 p-4 rounded-xl border border-border/40">
                    <MapPin className="text-primary shrink-0" size={18} />
                    <span>No pickup or drop location required. Please arrive at the designated starting point for your tour.</span>
                  </div>
                  
                  {toursLoading ? (
                    <div className="py-12 flex flex-col items-center text-muted-foreground">
                      <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                      <p>Loading tour packages...</p>
                    </div>
                  ) : tourPackages.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-amber-500" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">No Packages Available</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">Stay tuned packages will be available soon in your area!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tourPackages.map((tour) => {
                        const carOptions = tour.carOptions ? (typeof tour.carOptions === 'string' ? JSON.parse(tour.carOptions) : tour.carOptions) : [];
                        const isSelected = selectedTourPackage?.id === tour.id;
                        const displayPrice = isSelected && selectedTourCar ? selectedTourCar.price : (tour.basePrice || tour.price);
                        
                        return (
                          <div 
                            key={tour.id} 
                            className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all flex flex-col relative ${isSelected ? 'bg-primary/5 border-primary ring-1 ring-primary shadow-lg scale-[1.02] z-10' : 'bg-card border-border/60 hover:border-border hover:bg-secondary/30'}`}
                            onClick={() => {
                              setSelectedTourPackage(tour);
                              if (carOptions.length > 0) setSelectedTourCar(carOptions[0]);
                              else setSelectedTourCar(null);
                            }}
                          >
                            {isSelected && (
                              <div className="absolute top-3 right-3 text-primary">
                                <CheckCircle2 className="w-5 h-5 fill-primary text-primary-foreground" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-black text-base text-foreground pr-8 mb-1">{tour.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{tour.description}</p>
                              
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-secondary w-fit px-2.5 py-1 rounded-lg text-muted-foreground mb-4">
                                <Clock size={12} className="text-primary" />
                                <span>{tour.duration}</span>
                              </div>
                              
                              {isSelected && carOptions.length > 0 && (
                                <div className="mt-3 mb-2" onClick={(e) => e.stopPropagation()}>
                                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Select Vehicle Variant</label>
                                  <select 
                                    value={selectedTourCar?.name || ''} 
                                    onChange={(e) => {
                                      const opt = carOptions.find((o: any) => o.name === e.target.value);
                                      if (opt) setSelectedTourCar(opt);
                                    }}
                                    className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                  >
                                    {carOptions.map((opt: any, idx: number) => (
                                      <option key={idx} value={opt.name}>{opt.name} - ₹{opt.price}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                {carOptions.length > 0 && !isSelected ? "Starting From" : "Package Fare"}
                              </span>
                              <span className="text-lg font-black text-amber-500">₹{displayPrice}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                    <span>Route Map Preview</span>
                    {routeLoading && (
                      <span className="flex items-center gap-1.5 text-amber-400 animate-pulse">
                        <Loader2 size={12} className="animate-spin" /> Calculating route geometry...
                      </span>
                    )}
                  </div>
                  <InteractiveMap
                    origin={pickupAddr}
                    destination={dropoffAddr}
                    distanceKm={routeInfo?.distanceKm}
                    durationText={routeInfo?.durationText}
                    polyline={routeInfo?.polyline}
                    className="h-56"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: VEHICLE SELECTION */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="bg-secondary/40 border border-border/40 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">KM</span>
                  <div>
                    <span className="text-muted-foreground block">Calculated Distance:</span>
                    <span className="font-bold text-foreground text-sm">{routeInfo?.distanceKm || 15} KM</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block">Estimated Travel Time:</span>
                  <span className="font-bold text-amber-500 text-sm">{routeInfo?.durationText || '30 Minutes'}</span>
                </div>
              </div>

              {pricingLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                  <p className="text-sm font-semibold text-foreground">Calculating Dynamic Vehicle Fares...</p>
                  <p className="text-xs text-muted-foreground">Applying distance formulas, minimum fares & night charges</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 -mx-2 pb-6">
                  {fareEstimates.map((veh) => {
                    const isSelected = selectedVehicle?.categoryId === veh.categoryId;
                    return (
                      <div
                        key={veh.categoryId}
                        onClick={() => setSelectedVehicle(veh)}
                        className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all flex flex-col relative ${
                          isSelected
                            ? 'bg-primary/5 border-primary ring-1 ring-primary shadow-lg scale-[1.02] z-10'
                            : 'bg-card border-border/60 hover:border-border hover:bg-secondary/30'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-primary">
                            <CheckCircle2 className="w-5 h-5 fill-primary text-primary-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between pr-8 mb-2">
                            <h4 className="font-black text-base text-foreground">{veh.categoryName}</h4>
                            <span className="text-lg font-mono font-black text-amber-500">₹{veh.estimatedFare}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 min-h-[32px]">{veh.categoryDescription}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 font-medium pb-3 border-b border-border/40">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-primary" />
                              <span>{veh.seatingCapacity} Seats</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-primary" />
                              <span>{veh.luggageCapacity} Bags</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                          <span>Base: ₹{veh.basePrice} ({veh.includedKm}km incl.)</span>
                          <span>₹{veh.pricePerKm}/km</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PASSENGER DETAILS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {activeTab === 'Tours' ? (
                <div className="bg-secondary/20 p-4 rounded-2xl border border-border/40 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                    <Calendar size={18} />
                    <span>Select Tour Date & Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Date of Tour</label>
                      <input
                        type="date"
                        {...register('pickupDate')}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Reporting Time</label>
                      <input
                        type="time"
                        {...register('pickupTime')}
                        className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/20 p-4 rounded-2xl border border-border/40">
                  <ScheduleSelector
                    isScheduled={isScheduled}
                    onScheduleChange={setIsScheduled}
                    selectedDate={scheduledDate}
                    onDateChange={setScheduledDate}
                    selectedTimeStr={scheduledTimeStr}
                    onTimeChange={setScheduledTimeStr}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeTab !== 'Tours' && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name *</label>
                    <input
                      {...register('customerName')}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    {errors.customerName && <p className="mt-1 text-xs text-destructive">{errors.customerName.message}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Mobile Number *</label>
                  <input
                    {...register('customerPhone')}
                    maxLength={10}
                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  {errors.customerPhone && <p className="mt-1 text-xs text-destructive">{errors.customerPhone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address (Optional)</label>
                  <input
                    {...register('customerEmail')}
                    placeholder="rahul@example.com"
                    className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  {errors.customerEmail && <p className="mt-1 text-xs text-destructive">{errors.customerEmail.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Passengers *</label>
                  <select
                    {...register('passengers', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  >
                    {Array.from(
                      { length: activeTab === 'Tours' ? (selectedTourCar?.maxPassengers || 4) : 17 }, 
                      (_, i) => activeTab === 'Tours' ? i + 1 : [1, 2, 3, 4, 5, 6, 7, 8, 12, 17][i]
                    ).filter(Boolean).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                {activeTab === 'Airport' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Flight Number (Optional)</label>
                    <input
                      {...register('flightNumber')}
                      placeholder="e.g. IndiGo 6E-5432"
                      className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                )}
              </div>

              {activeTab === 'Tours' && (watchPassengers || 0) > 0 && (
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users size={16} className="text-primary" /> Passenger Names
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: watchPassengers || 0 }).map((_, idx) => (
                      <div key={idx}>
                        <input
                          {...register(`passengerNames.${idx}` as any, { required: "Name is required" })}
                          placeholder={`Passenger ${idx + 1} Name`}
                          className="w-full rounded-xl border border-border bg-input/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                        {errors.passengerNames?.[idx] && (
                          <p className="mt-1 text-[10px] text-destructive">{(errors.passengerNames[idx] as any)?.message || "Required"}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Special Notes / Instructions</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="e.g. Clean AC cab, elder passenger assistance required..."
                  className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: BOOKING REVIEW & CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="bg-secondary/50 border border-border/60 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                      {activeTab === 'Tours' ? <MapPin size={20} /> : <Car size={20} />}
                    </div>
                    <div>
                      <h4 className="font-black text-base text-foreground">
                        {activeTab === 'Tours' ? selectedTourPackage?.name : (selectedVehicle?.categoryName || 'City Cab')}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {isScheduled ? 'Scheduled Ride' : 'Immediate Booking (Book Now)'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Total Estimated Fare</span>
                    <span className="text-2xl font-mono font-black text-amber-500">
                      ₹{activeTab === 'Rental' ? 800 : (activeTab === 'Tours' ? (selectedTourCar ? selectedTourCar.price : (selectedTourPackage?.basePrice || selectedTourPackage?.price)) : selectedVehicle?.estimatedFare || 1200)}
                    </span>
                  </div>
                </div>

                {isScheduled && scheduledDate && scheduledTimeStr && (
                  <div className="flex items-center justify-between py-2 border-b border-border/40">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Scheduled For</div>
                    <div className="text-sm font-bold text-foreground">
                      {scheduledDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {scheduledTimeStr}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {activeTab === 'Tours' ? (
                    <>
                      <div>
                        <span className="text-muted-foreground block">Tour Package:</span>
                        <span className="font-semibold text-foreground">{selectedTourPackage?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Vehicle Variant:</span>
                        <span className="font-semibold text-foreground">{selectedTourCar ? selectedTourCar.name : 'Standard'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Tour Duration:</span>
                        <span className="font-semibold text-foreground">{selectedTourPackage?.duration}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground block">Passengers:</span>
                        <span className="font-semibold text-foreground">
                          {watch('passengerNames')?.filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-muted-foreground block">Pickup Location:</span>
                        <span className="font-semibold text-foreground">{pickupAddr}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Dropoff Destination:</span>
                        <span className="font-semibold text-foreground">{dropoffAddr || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Distance & Duration:</span>
                        <span className="font-semibold text-foreground">{routeInfo?.distanceKm || 15} KM (~{routeInfo?.durationText || '30 Min'})</span>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-muted-foreground block">Travel Date & Time:</span>
                    <span className="font-semibold text-foreground">{watch('pickupDate')} at {watch('pickupTime')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck size={16} />
                    <span>Rate Card Verified & Locked</span>
                  </div>
                  <span>Instant Driver Assignment</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40 shrink-0 mt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (activeTab === 'Tours' && prev === 3 ? 1 : prev - 1) as any)}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-secondary/50 text-xs font-bold text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-border bg-secondary/50 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1) handleNextToVehicles();
                if (step === 2) handleNextToPassenger();
                if (step === 3) handleNextToReview();
              }}
              disabled={loading || (step === 1 && routeLoading)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              <span>Next Step</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onFinalSubmit)}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-xs font-black text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Confirming Ride...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Confirm & Book Ride Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
