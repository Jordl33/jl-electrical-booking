export interface TimeSlot {
  timeIndex: number; // 0-15 representing 30-minute intervals (8:00, 8:30, 9:00, etc.)
  day: string;
  date: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  day: string;
  date: string;
  startTimeIndex: number; // 0-15 representing 30-minute intervals
  duration: number; // duration in hours (can be decimal like 0.5, 1.5, etc.)
  description?: string;
}

export interface WeekView {
  weekStart: Date;
  days: string[];
}

export type SlotStatus = 'available' | 'booked' | 'preview' | 'conflict' | 'selected';