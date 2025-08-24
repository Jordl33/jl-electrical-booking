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
    const baseClasses = 'h-12 m-0.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer relative flex items-center justify-center border-0';
    
    switch (status) {
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 hover:scale-105 active:scale-95 hover:from-emerald-500 hover:to-teal-600`;
      case 'booked':
        return `${baseClasses} bg-gradient-to-br from-slate-400 to-slate-500 text-white/90 cursor-not-allowed shadow-md shadow-slate-500/20 opacity-60`;
      case 'preview':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 scale-105 ring-2 ring-blue-300/50 ${isClickable ? 'hover:from-blue-600 hover:to-indigo-700 hover:shadow-2xl' : ''}`;
      case 'selected':
        return `${baseClasses} bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-600/40 scale-105 ring-4 ring-blue-400/60 font-bold`;
      case 'conflict':
        return `${baseClasses} bg-gradient-to-br from-orange-500 to-red-500 text-white cursor-not-allowed shadow-xl shadow-orange-500/30 scale-105 ring-2 ring-orange-300/50`;
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
      className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl shadow-gray-900/10 border border-gray-200/20 overflow-hidden p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSlotDeselect();
        }
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="flex items-center justify-center h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg">
          <span className="font-bold text-white text-sm">Time</span>
        </div>
        {WORKING_HOURS.days.map((day, index) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + index);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={day} className={`flex flex-col items-center justify-center h-16 rounded-2xl shadow-lg text-center ${
              isToday 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30' 
                : 'bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-gray-700/30'
            }`}>
              <div className="font-bold text-sm">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
              <div className="text-xs opacity-90 mt-1">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {isToday && <span className="ml-1 text-blue-100">(Today)</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="space-y-3">
        {Array.from({ length: WORKING_HOURS.endTimeIndex - WORKING_HOURS.startTimeIndex }, (_, i) => {
          const timeIndex = WORKING_HOURS.startTimeIndex + i;
          const isHourMark = timeIndex % 2 === 0;
          
          return (
            <div key={timeIndex} className="grid grid-cols-6 gap-4 items-center">
              {/* Time label - only show on hour marks */}
              <div className="flex items-center justify-center">
                {isHourMark && (
                  <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white px-3 py-2 rounded-xl shadow-md text-center min-w-[80px]">
                    <div className="font-bold text-xs">
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
                      <div className="text-center">
                        <div className="font-bold truncate text-xs leading-tight drop-shadow-sm">{booking.customerName}</div>
                        <div className="text-xs opacity-90 drop-shadow-sm">{booking.duration}h</div>
                      </div>
                    )}
                    
                    {/* Preview label - only show on first slot of preview */}
                    {status === 'preview' && hoveredSlot?.timeIndex === timeIndex && (
                      <div className="text-center">
                        <div className="font-bold text-xs leading-tight drop-shadow-sm">Preview</div>
                        <div className="text-xs opacity-90 drop-shadow-sm">{duration}h</div>
                      </div>
                    )}

                    {/* Conflict label - only show on first slot of conflict during preview */}
                    {status === 'conflict' && hoveredSlot?.timeIndex === timeIndex && (
                      <div className="text-center">
                        <div className="font-bold text-xs leading-tight drop-shadow-sm">Conflict</div>
                        <div className="text-xs opacity-90 drop-shadow-sm">{duration}h</div>
                      </div>
                    )}

                    {/* Selected label - only show on first slot of selection */}
                    {status === 'selected' && selectedSlots?.startTimeIndex === timeIndex && (
                      <div className="text-center">
                        <div className="font-bold text-xs leading-tight drop-shadow-sm">Selected</div>
                        <div className="text-xs opacity-90 drop-shadow-sm">{duration}h</div>
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