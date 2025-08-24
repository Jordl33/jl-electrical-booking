'use client';

import { useState } from 'react';
import DurationSelector from '@/components/DurationSelector';
import CalendarGrid from '@/components/CalendarGrid';
import BookingModal from '@/components/BookingModal';
import WeekNavigation from '@/components/WeekNavigation';
import BookNowButton from '@/components/BookNowButton';
import { Booking } from '@/types/booking';
import { mockBookings } from '@/data/mockBookings';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl shadow-black/10 p-8 border border-gray-200/20">
            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              J L Electrical Services
            </h1>
            <p className="text-xl text-gray-700 font-semibold mb-2">
              Professional electrical services booking - Monday to Friday, 8:00 AM to 4:00 PM
            </p>
            <p className="text-gray-600 text-lg">
              Select your preferred time slot with 30-minute precision
            </p>
          </div>
        </header>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl shadow-black/10 p-6 border border-gray-200/20">
            <WeekNavigation 
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
            />
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl shadow-black/10 p-6 border border-gray-200/20">
            <DurationSelector 
              duration={duration} 
              onDurationChange={(newDuration) => {
                setDuration(newDuration);
                setSelectedSlots(null); // Clear selection when duration changes
              }} 
            />
          </div>

          <CalendarGrid
            weekStart={currentWeek}
            duration={duration}
            existingBookings={bookings}
            selectedSlots={selectedSlots}
            onSlotSelect={handleSlotSelect}
            onSlotDeselect={handleSlotDeselect}
          />
        </div>

        <div className="mt-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl shadow-black/10 p-8 border border-gray-200/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Book</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Color Legend:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25"></div>
                  <span className="text-gray-700 font-medium">Available</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl shadow-md shadow-slate-500/20 opacity-60"></div>
                  <span className="text-gray-700 font-medium">Booked</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl shadow-blue-500/30"></div>
                  <span className="text-gray-700 font-medium">Preview / Selected</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-xl shadow-orange-500/30"></div>
                  <span className="text-gray-700 font-medium">Conflict</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Instructions:</h4>
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">1. Select job duration above</p>
                <p className="font-medium">2. Hover to preview time slots</p>
                <p className="font-medium">3. Click to select time slot</p>
                <p className="font-medium">4. Use &ldquo;Book Now&rdquo; button to confirm</p>
                <p className="font-medium">5. Navigate weeks to book future dates</p>
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
