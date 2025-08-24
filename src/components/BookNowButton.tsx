'use client';

import { formatTime } from '@/lib/bookingUtils';

interface BookNowButtonProps {
  isVisible: boolean;
  selectedSlots: {
    day: string;
    date: string;
    startTimeIndex: number;
    duration: number;
  } | null;
  onBook: () => void;
}

export default function BookNowButton({ isVisible, selectedSlots, onBook }: BookNowButtonProps) {
  if (!isVisible || !selectedSlots) {
    return null;
  }

  const endTimeIndex = selectedSlots.startTimeIndex + (selectedSlots.duration * 2);
  const durationText = selectedSlots.duration === 1 ? '1 hour' : `${selectedSlots.duration} hours`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 min-w-80 transform transition-all duration-300 ease-out">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Selected Time Slot</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="font-medium">{selectedSlots.day}, {new Date(selectedSlots.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
            <div>{formatTime(selectedSlots.startTimeIndex)} - {formatTime(endTimeIndex)}</div>
            <div className="text-blue-600 font-medium">{durationText}</div>
          </div>
        </div>
        
        <button
          onClick={onBook}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Book This Appointment
        </button>
      </div>
    </div>
  );
}