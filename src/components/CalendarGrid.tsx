'use client';

import { useState } from 'react';
import { Booking, SlotStatus } from '@/types/booking';
import { 
  canBookAtTime, 
  formatTime,
  formatTimeShort,
  WORKING_HOURS 
} from '@/lib/bookingUtils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    const baseClasses = 'h-8 mx-0.5 my-1 text-xs font-medium transition-all duration-200 cursor-pointer relative flex items-center justify-center rounded-md border';
    
    switch (status) {
      case 'available':
        return cn(baseClasses, 'bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-sm');
      case 'booked':
        return cn(baseClasses, 'bg-muted border-muted-foreground/20 text-muted-foreground cursor-not-allowed');
      case 'preview':
        return cn(baseClasses, 'bg-blue-100 border-blue-200 text-blue-800 shadow-sm ring-1 ring-blue-200', 
          isClickable && 'hover:bg-blue-200');
      case 'selected':
        return cn(baseClasses, 'bg-blue-500 border-blue-600 text-white shadow-sm ring-2 ring-blue-300 font-semibold');
      case 'conflict':
        return cn(baseClasses, 'bg-destructive/10 border-destructive/20 text-destructive cursor-not-allowed');
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
    <Card className="w-full">
      <CardHeader className="pb-3">
        {/* Header */}
        <div className="grid grid-cols-6 gap-3">
          <div className="flex items-center justify-center h-10 bg-primary rounded-md">
            <span className="font-medium text-primary-foreground text-sm">Time</span>
          </div>
        {WORKING_HOURS.days.map((day, index) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + index);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={day} className={cn(
              "flex flex-col items-center justify-center h-10 rounded-md text-center",
              isToday 
                ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                : 'bg-muted text-muted-foreground'
            )}>
              <div className="font-medium text-sm">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
              <div className="text-xs">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {isToday && <Badge variant="secondary" className="ml-1 text-xs px-1 py-0">Today</Badge>}
              </div>
            </div>
          );
        })}
      </div>

      </CardHeader>
      <CardContent>
        {/* Time slots */}
        <div className="space-y-1">
          {Array.from({ length: WORKING_HOURS.endTimeIndex - WORKING_HOURS.startTimeIndex }, (_, i) => {
            const timeIndex = WORKING_HOURS.startTimeIndex + i;
            const isHourMark = timeIndex % 2 === 0;
            
            return (
              <div key={timeIndex} className="grid grid-cols-6 gap-3 items-center">
                {/* Time label - only show on hour marks */}
                <div className="flex items-center justify-center">
                  {isHourMark && (
                    <Badge variant="outline" className="text-xs font-medium min-w-[70px] justify-center">
                      <span className="hidden sm:inline">{formatTime(timeIndex)}</span>
                      <span className="sm:hidden">{formatTimeShort(timeIndex)}</span>
                    </Badge>
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
                        <div className="font-medium truncate text-xs leading-tight">{booking.customerName}</div>
                        <div className="text-xs opacity-80">{booking.duration}h</div>
                      </div>
                    )}
                    
                    {/* Preview label - only show on first slot of preview */}
                    {status === 'preview' && hoveredSlot?.timeIndex === timeIndex && (
                      <div className="text-center">
                        <div className="font-medium text-xs leading-tight">Preview</div>
                        <div className="text-xs opacity-80">{duration}h</div>
                      </div>
                    )}

                    {/* Conflict label - only show on first slot of conflict during preview */}
                    {status === 'conflict' && hoveredSlot?.timeIndex === timeIndex && (
                      <div className="text-center">
                        <div className="font-medium text-xs leading-tight">Conflict</div>
                        <div className="text-xs opacity-80">{duration}h</div>
                      </div>
                    )}

                    {/* Selected label - only show on first slot of selection */}
                    {status === 'selected' && selectedSlots?.startTimeIndex === timeIndex && (
                      <div className="text-center">
                        <div className="font-semibold text-xs leading-tight">Selected</div>
                        <div className="text-xs opacity-90">{duration}h</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        </div>
      </CardContent>
    </Card>
  );
}