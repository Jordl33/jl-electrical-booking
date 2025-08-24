'use client';

import { useState, useMemo } from 'react';
import { Booking, SlotStatus } from '@/types/booking';
import { 
  generateTimeSlots, 
  canBookAtTime, 
  checkConflict,
  getConflictingBookings,
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

  const timeSlots = useMemo(() => generateTimeSlots(weekStart), [weekStart]);
  
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
        const hasConflict = checkConflict(startTimeIndex, duration, day, date, existingBookings);
        return hasConflict ? 'conflict' : 'preview';
      }
    }

    // Check if this slot is part of a conflicting booking when hovering
    if (hoveredSlot && hoveredSlot.day === day) {
      const conflictingBookings = getConflictingBookings(hoveredSlot.timeIndex, duration, day, date, existingBookings);
      const isPartOfConflictingBooking = conflictingBookings.some(booking =>
        timeIndex >= booking.startTimeIndex && 
        timeIndex < booking.startTimeIndex + (booking.duration * 2)
      );
      
      if (isPartOfConflictingBooking) return 'conflict';
    }

    return 'available';
  };

  const getSlotClassName = (status: SlotStatus, isClickable: boolean): string => {
    const baseClasses = 'h-8 border-r border-b border-gray-100 text-xs font-medium transition-all duration-200 cursor-pointer relative hover:z-10';
    
    switch (status) {
      case 'available':
        return `${baseClasses} bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-gray-800 hover:shadow-md border-l-2 border-l-transparent hover:border-l-green-400`;
      case 'booked':
        return `${baseClasses} bg-gradient-to-br from-red-50 to-rose-50 text-gray-800 cursor-not-allowed border-l-2 border-l-red-300`;
      case 'preview':
        return `${baseClasses} bg-gradient-to-br from-blue-100 to-indigo-100 text-gray-800 shadow-md border-l-2 border-l-blue-400 ${isClickable ? 'hover:from-blue-200 hover:to-indigo-200' : ''}`;
      case 'selected':
        return `${baseClasses} bg-gradient-to-br from-blue-200 to-indigo-200 text-gray-900 shadow-lg border-l-4 border-l-blue-600 font-semibold`;
      case 'conflict':
        return `${baseClasses} bg-gradient-to-br from-orange-100 to-amber-100 text-gray-800 cursor-not-allowed shadow-md border-l-2 border-l-orange-400`;
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
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSlotDeselect();
        }
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="p-4 font-semibold text-gray-800 text-sm border-r border-gray-200">
          Time
        </div>
        {WORKING_HOURS.days.map((day, index) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + index);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={day} className="p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className={`font-semibold text-sm ${isToday ? 'text-blue-700' : 'text-gray-800'}`}>
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
              <div className={`text-xs mt-1 ${isToday ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {isToday && <span className="ml-1">(Today)</span>}
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
            <div key={timeIndex} className={`grid grid-cols-6 ${isHourMark ? 'border-t-2 border-gray-200' : ''}`}>
              {/* Time label - only show on hour marks */}
              <div className={`flex items-center justify-end pr-4 bg-gradient-to-r from-gray-50 to-gray-25 border-r border-gray-100 ${isHourMark ? 'h-16' : 'h-8'}`}>
                {isHourMark && (
                  <div className="text-right">
                    <div className="font-semibold text-gray-800 text-sm">
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
                          <div className="font-semibold truncate text-xs leading-tight">{booking.customerName}</div>
                          <div className="text-xs opacity-75">{booking.duration}h</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Preview label - only show on first slot of preview */}
                    {status === 'preview' && hoveredSlot?.timeIndex === timeIndex && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="font-semibold text-xs leading-tight">Preview</div>
                          <div className="text-xs opacity-75">{duration}h</div>
                        </div>
                      </div>
                    )}

                    {/* Selected label - only show on first slot of selection */}
                    {status === 'selected' && selectedSlots?.startTimeIndex === timeIndex && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="font-semibold text-xs leading-tight text-blue-900">Selected</div>
                          <div className="text-xs opacity-75 text-blue-800">{duration}h</div>
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