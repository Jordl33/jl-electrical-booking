import { Booking } from '@/types/booking';
import { hourToTimeIndex } from '@/lib/bookingUtils';

const getCurrentWeekStart = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const weekStart = getCurrentWeekStart();

export const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'John Smith',
    day: 'Monday',
    date: new Date(weekStart.getTime()).toISOString().split('T')[0],
    startTimeIndex: hourToTimeIndex(9), // 9:00 AM
    duration: 2,
    description: 'Kitchen outlet installation'
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    day: 'Tuesday',
    date: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTimeIndex: hourToTimeIndex(14), // 2:00 PM
    duration: 2.5,
    description: 'Electrical panel upgrade'
  },
  {
    id: '3',
    customerName: 'Mike Davis',
    day: 'Wednesday',
    date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTimeIndex: hourToTimeIndex(8), // 8:00 AM
    duration: 3.5,
    description: 'Full rewiring - basement'
  },
  {
    id: '4',
    customerName: 'Lisa Wilson',
    day: 'Thursday',
    date: new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTimeIndex: hourToTimeIndex(10.5), // 10:30 AM
    duration: 1,
    description: 'Light fixture replacement'
  },
  {
    id: '5',
    customerName: 'Robert Brown',
    day: 'Friday',
    date: new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTimeIndex: hourToTimeIndex(13), // 1:00 PM
    duration: 2.5,
    description: 'Outdoor lighting installation'
  }
];