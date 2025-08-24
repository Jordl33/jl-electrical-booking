'use client';

import { useState } from 'react';
import { Booking, SlotStatus } from '@/types/booking';
import { 
  canBookAtTime, 
  formatTime,
  formatTimeShort,
  WORKING_HOURS 
} from '@/lib/bookingUtils';

interface CalendarGridProps {
  weekStart: Date;
  duration: number;
  existingBookings: Booking[];
  selectedSlots: {
    day: string;
    date: string;
    startTimeIndex: number;
    duration: number;
  } | null;
  onSlotSelect: (day: string, date: string, startTimeIndex: number) => void;
  onSlotDeselect: () => void;
}

export default function CalendarGrid({ 
  weekStart, 
  duration, 
  existingBookings,
  selectedSlots,
  onSlotSelect,
  onSlotDeselect
}: CalendarGridProps) {
  const [hoveredSlot, setHoveredSlot] = useState<{ day: string; timeIndex: number } | null>(null);

  
  const getDayDate = (dayIndex: number): string => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + dayIndex);
    return date.toISOString().split('T')[0];
  };

  const getSlotStatus = (day: string, timeIndex: number, date: string): SlotStatus => {
    // Check if this slot is part of an existing booking
    const isBooked = existingBookings.some(booking => 
      booking.day === day && 
      booking.date === date &&
      timeIndex >= booking.startTimeIndex && 
      timeIndex < booking.startTimeIndex + (booking.duration * 2)
    );

    if (isBooked) return 'booked';

    // Check if this slot is part of selected slots
    if (selectedSlots && selectedSlots.day === day && selectedSlots.date === date) {
      const selectedEndTimeIndex = selectedSlots.startTimeIndex + (selectedSlots.duration * 2);
      if (timeIndex >= selectedSlots.startTimeIndex && timeIndex < selectedEndTimeIndex) {
        return 'selected';
      }
    }

    // Check hover preview
    if (hoveredSlot && hoveredSlot.day === day) {
      const startTimeIndex = hoveredSlot.timeIndex;
      const endTimeIndex = startTimeIndex + (duration * 2);
      
      if (timeIndex >= startTimeIndex && timeIndex < endTimeIndex) {
        // Check if this specific slot within the preview range conflicts with existing bookings
        const slotConflict = existingBookings.some(booking => 
          booking.day === day && 
          booking.date === date &&
          timeIndex >= booking.startTimeIndex && 
          timeIndex < booking.startTimeIndex + (booking.duration * 2)
        );
        
        // Also check if the overall selection would extend beyond working hours
        const exceedsWorkingHours = endTimeIndex > WORKING_HOURS.endTimeIndex;
        
        return (slotConflict || exceedsWorkingHours) ? 'conflict' : 'preview';
      }
    }


    return 'available';
  };

  const getSlotClassName = (status: SlotStatus, isClickable: boolean): string => {
    const baseClasses = 'h-8 border-r border-b border-slate-100/50 text-xs font-medium transition-all duration-300 cursor-pointer relative hover:z-10 backdrop-blur-sm';
    
    switch (status) {
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-emerald-50/80 to-teal-50/80 hover:from-emerald-100/90 hover:to-teal-100/90 text-slate-700 hover:shadow-lg hover:shadow-emerald-500/10 border-l-2 border-l-transparent hover:border-l-emerald-400 hover:scale-[1.02] active:scale-[0.98]`;
      case 'booked':
        return `${baseClasses} bg-gradient-to-br from-slate-100/80 to-gray-100/80 text-slate-500 cursor-not-allowed border-l-2 border-l-slate-300/60 opacity-75`;
      case 'preview':
        return `${baseClasses} bg-gradient-to-br from-blue-100/90 to-indigo-100/90 text-slate-800 shadow-lg shadow-blue-500/15 border-l-3 border-l-blue-400 scale-[1.02] ring-1 ring-blue-200/50 ${isClickable ? 'hover:from-blue-200/90 hover:to-indigo-200/90' : ''}`;
      case 'selected':
        return `${baseClasses} bg-gradient-to-br from-blue-200/95 to-indigo-200/95 text-slate-900 shadow-xl shadow-blue-500/20 border-l-4 border-l-blue-600 font-semibold scale-[1.02] ring-2 ring-blue-300/50`;
      case 'conflict':
        return `${baseClasses} bg-gradient-to-br from-orange-100/90 to-amber-100/90 text-slate-800 cursor-not-allowed shadow-lg shadow-orange-500/15 border-l-3 border-l-orange-400 scale-[1.02] ring-1 ring-orange-200/50`;
      default:
        return baseClasses;
    }
  };

  const handleSlotHover = (day: string, timeIndex: number, date: string) => {
    if (canBookAtTime(timeIndex, duration, day, date, existingBookings)) {
      setHoveredSlot({ day, timeIndex });
    } else {
      setHoveredSlot(null);
    }
  };

  const handleSlotClick = (day: string, timeIndex: number, date: string) => {
    if (selectedSlots && selectedSlots.day === day && selectedSlots.date === date && selectedSlots.startTimeIndex === timeIndex) {
      // Clicking on already selected slots - deselect
      onSlotDeselect();
    } else if (canBookAtTime(timeIndex, duration, day, date, existingBookings)) {
      // Select new time slot
      onSlotSelect(day, date, timeIndex);
    }
  };

  const getBookingInfo = (day: string, timeIndex: number, date: string): Booking | null => {
    return existingBookings.find(booking => 
      booking.day === day && 
      booking.date === date &&
      timeIndex >= booking.startTimeIndex && 
      timeIndex < booking.startTimeIndex + (booking.duration * 2)
    ) || null;
  };

  return (
    <div 
      className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-500/10 border border-slate-200/50 overflow-hidden ring-1 ring-slate-100/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSlotDeselect();
        }
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-6 bg-gradient-to-r from-slate-50/90 to-slate-100/90 border-b border-slate-200/50 backdrop-blur-sm">
        <div className="p-4 font-semibold text-slate-700 text-sm border-r border-slate-200/50">
          Time
        </div>
        {WORKING_HOURS.days.map((day, index) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + index);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={day} className="p-4 text-center border-r border-slate-200/50 last:border-r-0">
              <div className={`font-semibold text-sm ${isToday ? 'text-blue-700 bg-blue-50/50 px-2 py-1 rounded-lg' : 'text-slate-700'}`}>
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
              <div className={`text-xs mt-1 ${isToday ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {isToday && <span className="ml-1 bg-blue-100/70 px-1.5 py-0.5 rounded-full text-blue-700">(Today)</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="relative">
        {Array.from({ length: WORKING_HOURS.endTimeIndex - WORKING_HOURS.startTimeIndex }, (_, i) => {
          const timeIndex = WORKING_HOURS.startTimeIndex + i;
          const isHourMark = timeIndex % 2 === 0;
          
          return (
            <div key={timeIndex} className={`grid grid-cols-6 ${isHourMark ? 'border-t-2 border-slate-200/60' : ''}`}>
              {/* Time label - only show on hour marks */}
              <div className={`flex items-center justify-end pr-4 bg-gradient-to-r from-slate-50/80 to-slate-25/80 border-r border-slate-100/50 ${isHourMark ? 'h-16' : 'h-8'}`}>
                {isHourMark && (
                  <div className="text-right">
                    <div className="font-semibold text-slate-600 text-sm">
                      <span className="hidden sm:inline">{formatTime(timeIndex)}</span>
                      <span className="sm:hidden">{formatTimeShort(timeIndex)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Day columns */}
              {WORKING_HOURS.days.map((day, dayIndex) => {
                const date = getDayDate(dayIndex);
                const status = getSlotStatus(day, timeIndex, date);
                const booking = getBookingInfo(day, timeIndex, date);
                const isClickable = canBookAtTime(timeIndex, duration, day, date, existingBookings);

                return (
                  <div
                    key={`${day}-${timeIndex}`}
                    className={getSlotClassName(status, isClickable)}
                    onMouseEnter={() => handleSlotHover(day, timeIndex, date)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onClick={() => handleSlotClick(day, timeIndex, date)}
                    title={booking ? `${booking.customerName} - ${booking.description || 'No description'}` : ''}
                  >
                    {/* Booking info - only show on first slot of booking */}
                    {booking && timeIndex === booking.startTimeIndex && (
                      <div className="absolute inset-0 flex items-center justify-center p-1 z-10">
                        <div className="text-center">
                          <div className="font-semibold truncate text-xs leading-tight text-slate-600">{booking.customerName}</div>
                          <div className="text-xs text-slate-500/80">{booking.duration}h</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Preview label - only show on first slot of preview */}
                    {status === 'preview' && hoveredSlot?.timeIndex === timeIndex && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="font-semibold text-xs leading-tight text-blue-800">Preview</div>
                          <div className="text-xs text-blue-700/80">{duration}h</div>
                        </div>
                      </div>
                    )}

                    {/* Conflict label - only show on first slot of conflict during preview */}
                    {status === 'conflict' && hoveredSlot?.timeIndex === timeIndex && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="font-semibold text-xs leading-tight text-orange-800">Conflict</div>
                          <div className="text-xs text-orange-700/80">{duration}h</div>
                        </div>
                      </div>
                    )}

                    {/* Selected label - only show on first slot of selection */}
                    {status === 'selected' && selectedSlots?.startTimeIndex === timeIndex && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="font-semibold text-xs leading-tight text-blue-900">Selected</div>
                          <div className="text-xs text-blue-800/80">{duration}h</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}