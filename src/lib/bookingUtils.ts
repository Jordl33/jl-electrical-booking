import { Booking, TimeSlot } from '@/types/booking';

export const WORKING_HOURS = {
  startTimeIndex: 0, // 8:00 AM
  endTimeIndex: 16, // 4:00 PM (16 * 30min slots = 8 hours)
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
};

// Convert time index to actual time (0 = 8:00 AM, 1 = 8:30 AM, etc.)
export const timeIndexToHour = (timeIndex: number): number => {
  return 8 + (timeIndex * 0.5);
};

// Convert hour to time index
export const hourToTimeIndex = (hour: number): number => {
  return (hour - 8) * 2;
};

export const generateTimeSlots = (weekStart: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + dayIndex);
    
    const dayName = WORKING_HOURS.days[dayIndex];
    const dateString = currentDate.toISOString().split('T')[0];
    
    for (let timeIndex = WORKING_HOURS.startTimeIndex; timeIndex < WORKING_HOURS.endTimeIndex; timeIndex++) {
      slots.push({
        timeIndex,
        day: dayName,
        date: dateString,
        isBooked: false
      });
    }
  }
  
  return slots;
};

export const checkConflict = (
  startTimeIndex: number,
  duration: number,
  day: string,
  date: string,
  existingBookings: Booking[]
): boolean => {
  const endTimeIndex = startTimeIndex + (duration * 2); // Convert hours to 30-min slots
  
  return existingBookings.some(booking => {
    if (booking.day !== day || booking.date !== date) return false;
    
    const bookingEndTimeIndex = booking.startTimeIndex + (booking.duration * 2);
    
    return (
      (startTimeIndex >= booking.startTimeIndex && startTimeIndex < bookingEndTimeIndex) ||
      (endTimeIndex > booking.startTimeIndex && endTimeIndex <= bookingEndTimeIndex) ||
      (startTimeIndex <= booking.startTimeIndex && endTimeIndex >= bookingEndTimeIndex)
    );
  });
};

export const getConflictingBookings = (
  startTimeIndex: number,
  duration: number,
  day: string,
  date: string,
  existingBookings: Booking[]
): Booking[] => {
  const endTimeIndex = startTimeIndex + (duration * 2);
  
  return existingBookings.filter(booking => {
    if (booking.day !== day || booking.date !== date) return false;
    
    const bookingEndTimeIndex = booking.startTimeIndex + (booking.duration * 2);
    
    return (
      (startTimeIndex >= booking.startTimeIndex && startTimeIndex < bookingEndTimeIndex) ||
      (endTimeIndex > booking.startTimeIndex && endTimeIndex <= bookingEndTimeIndex) ||
      (startTimeIndex <= booking.startTimeIndex && endTimeIndex >= bookingEndTimeIndex)
    );
  });
};

export const canBookAtTime = (
  startTimeIndex: number,
  duration: number,
  day: string,
  date: string,
  existingBookings: Booking[]
): boolean => {
  const endTimeIndex = startTimeIndex + (duration * 2);
  
  if (endTimeIndex > WORKING_HOURS.endTimeIndex) return false;
  
  return !checkConflict(startTimeIndex, duration, day, date, existingBookings);
};

export const getMaxStartTimeIndexForDuration = (duration: number): number => {
  return WORKING_HOURS.endTimeIndex - (duration * 2);
};

export const formatTime = (timeIndex: number): string => {
  const totalMinutes = (timeIndex * 30) + (8 * 60); // Start from 8:00 AM
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const displayMinutes = minutes === 0 ? '00' : minutes.toString();
  
  return `${displayHour}:${displayMinutes} ${suffix}`;
};

export const formatTimeShort = (timeIndex: number): string => {
  const totalMinutes = (timeIndex * 30) + (8 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const suffix = hours >= 12 ? 'p' : 'a';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  if (minutes === 0) {
    return `${displayHour}${suffix}`;
  } else {
    return `${displayHour}:${minutes}${suffix}`;
  }
};