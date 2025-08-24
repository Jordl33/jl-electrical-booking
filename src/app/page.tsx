'use client';

import { useState } from 'react';
import DurationSelector from '@/components/DurationSelector';
import CalendarGrid from '@/components/CalendarGrid';
import BookingModal from '@/components/BookingModal';
import WeekNavigation from '@/components/WeekNavigation';
import BookNowButton from '@/components/BookNowButton';
import { Booking } from '@/types/booking';
import { mockBookings } from '@/data/mockBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">J L Electrical Services</CardTitle>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Professional electrical services booking - Monday to Friday, 8:00 AM to 4:00 PM
              </p>
              <p className="text-sm text-muted-foreground">
                Select your preferred time slot with 30-minute precision
              </p>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <WeekNavigation 
                currentWeek={currentWeek}
                onWeekChange={setCurrentWeek}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <DurationSelector 
                duration={duration} 
                onDurationChange={(newDuration) => {
                  setDuration(newDuration);
                  setSelectedSlots(null); // Clear selection when duration changes
                }} 
              />
            </CardContent>
          </Card>

          <CalendarGrid
            weekStart={currentWeek}
            duration={duration}
            existingBookings={bookings}
            selectedSlots={selectedSlots}
            onSlotSelect={handleSlotSelect}
            onSlotDeselect={handleSlotDeselect}
          />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Color Legend:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 bg-primary/10 border-primary/20"></Badge>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 bg-muted border-muted-foreground/20"></Badge>
                    <span className="text-sm">Booked</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="w-6 h-6 p-0 bg-blue-500"></Badge>
                    <span className="text-sm">Preview / Selected</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 bg-destructive/10 border-destructive/20"></Badge>
                    <span className="text-sm">Conflict</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Instructions:</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>1. Select job duration above</p>
                  <p>2. Hover to preview time slots</p>
                  <p>3. Click to select time slot</p>
                  <p>4. Use &ldquo;Book Now&rdquo; button to confirm</p>
                  <p>5. Navigate weeks to book future dates</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
