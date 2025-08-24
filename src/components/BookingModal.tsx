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
  day,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Book Appointment</h2>
          
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="text-sm text-gray-800">
              <div className="font-semibold text-blue-900 mb-1">{formattedDate}</div>
              <div className="font-medium">{formatTime(startTimeIndex)} - {formatTime(endTimeIndex)}</div>
              <div className="text-blue-700">{duration} hour{duration !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief description of the electrical work needed..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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