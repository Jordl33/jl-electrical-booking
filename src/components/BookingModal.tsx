'use client';

import { useState } from 'react';
import { formatTime } from '@/lib/bookingUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customerName: string, description: string) => void;
  day: string;
  date: string;
  startTimeIndex: number;
  duration: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  onConfirm,
  day: _day, // eslint-disable-line @typescript-eslint/no-unused-vars
  date,
  startTimeIndex,
  duration
}: BookingModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setIsSubmitting(true);
    try {
      onConfirm(customerName.trim(), description.trim());
      setCustomerName('');
      setDescription('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCustomerName('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  const endTimeIndex = startTimeIndex + (duration * 2);
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl shadow-black/20 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200/20">
        <div className="p-8">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Book Appointment</h2>
          
          <div className="mb-6 p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/30">
            <div className="text-white">
              <div className="font-bold text-lg mb-2">{formattedDate}</div>
              <div className="font-bold text-xl">{formatTime(startTimeIndex)} - {formatTime(endTimeIndex)}</div>
              <div className="bg-white/20 text-white font-bold px-4 py-2 rounded-full text-center mt-3 backdrop-blur-sm">{duration} hour{duration !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="customerName" className="block text-lg font-bold text-gray-900 mb-3">
                Customer Name *
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium"
                required
                autoFocus
              />
            </div>

            <div className="mb-8">
              <label htmlFor="description" className="block text-lg font-bold text-gray-900 mb-3">
                Job Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none font-medium"
                placeholder="Brief description of the electrical work needed..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-4 text-lg font-bold text-gray-700 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!customerName.trim() || isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}