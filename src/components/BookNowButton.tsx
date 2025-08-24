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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl shadow-black/20 border border-gray-200/20 p-6 min-w-80 transform transition-all duration-500 ease-out animate-pulse">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 mb-2">Selected Time Slot</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="font-bold text-blue-700">{selectedSlots.day}, {new Date(selectedSlots.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
            <div className="font-semibold text-gray-800">{formatTime(selectedSlots.startTimeIndex)} - {formatTime(endTimeIndex)}</div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-3 py-1 rounded-full text-center text-sm">{durationText}</div>
          </div>
        </div>
        
        <button
          onClick={onBook}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transform hover:scale-105 active:scale-95"
        >
          Book This Appointment
        </button>
      </div>
    </div>
  );
}