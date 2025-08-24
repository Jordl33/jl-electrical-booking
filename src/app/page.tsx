'use client';

import { useState, useMemo } from 'react';
import DurationSelector from '@/components/DurationSelector';
import CalendarGrid from '@/components/CalendarGrid';
import BookingModal from '@/components/BookingModal';
import WeekNavigation from '@/components/WeekNavigation';
import BookNowButton from '@/components/BookNowButton';
import { Booking } from '@/types/booking';
import { mockBookings } from '@/data/mockBookings';
import { hourToTimeIndex } from '@/lib/bookingUtils';

export default function Home() {
  const [duration, setDuration] = useState(2);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [currentWeek, setCurrentWeek] = useState<Date>(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  
  const [selectedSlots, setSelectedSlots] = useState<{
    day: string;
    date: string;
    startTimeIndex: number;
    duration: number;
  } | null>(null);
  
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    day: string;
    date: string;
    startTimeIndex: number;
  }>({
    isOpen: false,
    day: '',
    date: '',
    startTimeIndex: 0
  });

  const handleSlotSelect = (day: string, date: string, startTimeIndex: number) => {
    setSelectedSlots({
      day,
      date,
      startTimeIndex,
      duration
    });
  };

  const handleSlotDeselect = () => {
    setSelectedSlots(null);
  };

  const handleBookNow = () => {
    if (selectedSlots) {
      setBookingModal({
        isOpen: true,
        day: selectedSlots.day,
        date: selectedSlots.date,
        startTimeIndex: selectedSlots.startTimeIndex
      });
    }
  };

  const handleConfirmBooking = (customerName: string, description: string) => {
    if (selectedSlots) {
      const newBooking: Booking = {
        id: Date.now().toString(),
        customerName,
        day: selectedSlots.day,
        date: selectedSlots.date,
        startTimeIndex: selectedSlots.startTimeIndex,
        duration: selectedSlots.duration,
        description
      };

      setBookings(prev => [...prev, newBooking]);
      setSelectedSlots(null);
      setBookingModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleCloseModal = () => {
    setBookingModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
            J L Electrical Services
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Professional electrical services booking - Monday to Friday, 8:00 AM to 4:00 PM
          </p>
          <p className="text-gray-600 mt-1">
            Select your preferred time slot with 30-minute precision
          </p>
        </header>

        <div className="space-y-6">
          <WeekNavigation 
            currentWeek={currentWeek}
            onWeekChange={setCurrentWeek}
          />

          <DurationSelector 
            duration={duration} 
            onDurationChange={(newDuration) => {
              setDuration(newDuration);
              setSelectedSlots(null); // Clear selection when duration changes
            }} 
          />

          <CalendarGrid
            weekStart={currentWeek}
            duration={duration}
            existingBookings={bookings}
            selectedSlots={selectedSlots}
            onSlotSelect={handleSlotSelect}
            onSlotDeselect={handleSlotDeselect}
          />
        </div>

        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Book</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Color Legend:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-50 to-emerald-50 border-l-2 border-l-green-400 rounded"></div>
                  <span className="text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-br from-red-50 to-rose-50 border-l-2 border-l-red-300 rounded"></div>
                  <span className="text-gray-700">Booked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-100 to-indigo-100 border-l-2 border-l-blue-400 rounded"></div>
                  <span className="text-gray-700">Preview / Selected</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-br from-orange-100 to-amber-100 border-l-2 border-l-orange-400 rounded"></div>
                  <span className="text-gray-700">Conflict</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
              <div className="space-y-1 text-gray-600">
                <p>1. Select job duration above</p>
                <p>2. Hover to preview time slots</p>
                <p>3. Click to select time slot</p>
                <p>4. Use "Book Now" button to confirm</p>
                <p>5. Navigate weeks to book future dates</p>
              </div>
            </div>
          </div>
        </div>

        <BookNowButton
          isVisible={!!selectedSlots}
          selectedSlots={selectedSlots}
          onBook={handleBookNow}
        />

        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmBooking}
          day={bookingModal.day}
          date={bookingModal.date}
          startTimeIndex={bookingModal.startTimeIndex}
          duration={duration}
        />
      </div>
    </div>
  );
}
