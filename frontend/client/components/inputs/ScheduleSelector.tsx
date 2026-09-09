import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Calendar } from 'lucide-react';

interface ScheduleSelectorProps {
  isScheduled: boolean;
  onScheduleChange: (isScheduled: boolean) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  selectedTimeStr: string | null;
  onTimeChange: (timeStr: string) => void;
}

export function ScheduleSelector({
  isScheduled,
  onScheduleChange,
  selectedDate,
  onDateChange,
  selectedTimeStr,
  onTimeChange,
}: ScheduleSelectorProps) {
  const [dates, setDates] = useState<Date[]>([]);
  
  useEffect(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    setDates(arr);
    if (!selectedDate && arr.length > 0) {
      onDateChange(arr[0]);
    }
  }, []);

  const [timeSlots, setTimeSlots] = useState<{ label: string; period: string; disabled: boolean }[]>([]);

  useEffect(() => {
    if (!selectedDate) return;
    
    const slots = [];
    const now = new Date();
    const minBufferMinutes = 30;
    
    const isToday = selectedDate.toDateString() === now.toDateString();

    for (let hour = 6; hour <= 23; hour++) {
      for (let min = 0; min < 60; min += 30) {
        let period = 'Morning';
        if (hour >= 12 && hour < 17) period = 'Afternoon';
        if (hour >= 17) period = 'Evening';

        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayMin = min === 0 ? '00' : min;
        const label = `${displayHour}:${displayMin} ${ampm}`;

        let disabled = false;
        if (isToday) {
          const slotTime = new Date(selectedDate);
          slotTime.setHours(hour, min, 0, 0);
          
          const bufferTime = new Date(now.getTime() + minBufferMinutes * 60000);
          if (slotTime < bufferTime) {
            disabled = true;
          }
        }

        slots.push({ label, period, disabled });
      }
    }
    setTimeSlots(slots);
    
    const currentSlot = slots.find(s => s.label === selectedTimeStr);
    if (!currentSlot || currentSlot.disabled) {
      const firstAvailable = slots.find(s => !s.disabled);
      if (firstAvailable) {
        onTimeChange(firstAvailable.label);
      } else {
        onTimeChange('');
      }
    }
  }, [selectedDate, selectedTimeStr]);

  const periods = ['Morning', 'Afternoon', 'Evening'];

  return (
    <div className="space-y-4">
      <label className="block text-xs font-medium text-muted-foreground mb-1">When do you need your cab? *</label>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onScheduleChange(false)}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border",
            !isScheduled
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
              : "bg-input/50 text-muted-foreground border-border hover:bg-secondary"
          )}
        >
          <Clock size={16} />
          Book Now
        </button>
        <button
          type="button"
          onClick={() => onScheduleChange(true)}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border",
            isScheduled
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
              : "bg-input/50 text-muted-foreground border-border hover:bg-secondary"
          )}
        >
          <Calendar size={16} />
          Schedule Later
        </button>
      </div>

      {isScheduled && (
        <div className="space-y-6 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-top-4 duration-300">
          
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">Select Date</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {dates.map((d, i) => {
                const isSelected = selectedDate?.toDateString() === d.toDateString();
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dateNum = d.getDate();
                
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onDateChange(d)}
                    className={cn(
                      "snap-start shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl border transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-input/50 border-border text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <span className="text-[10px] uppercase font-bold opacity-80">{dayName}</span>
                    <span className="text-lg font-black">{dateNum}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">Select Time (30-min intervals)</label>
            
            <div className="max-h-[220px] overflow-y-auto pr-2 space-y-4 scrollbar-thin">
              {periods.map(period => {
                const periodSlots = timeSlots.filter(s => s.period === period);
                if (periodSlots.every(s => s.disabled)) return null;

                return (
                  <div key={period}>
                    <h5 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">{period}</h5>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {periodSlots.map((slot, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={slot.disabled}
                          onClick={() => onTimeChange(slot.label)}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all border",
                            slot.disabled
                              ? "opacity-30 bg-secondary border-border/50 cursor-not-allowed"
                              : selectedTimeStr === slot.label
                                ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                                : "bg-input/50 border-border text-foreground hover:bg-secondary"
                          )}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
              
              {timeSlots.every(s => s.disabled) && (
                <div className="text-center py-6 text-sm text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border">
                  No available time slots left for today.<br/>Please select a different date.
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
