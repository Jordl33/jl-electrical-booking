'use client';

import { useState } from 'react';
import { formatTime } from '@/lib/bookingUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="space-y-2">
            <div className="font-semibold text-blue-900">{formattedDate}</div>
            <div className="font-medium text-blue-800">{formatTime(startTimeIndex)} - {formatTime(endTimeIndex)}</div>
            <Badge variant="secondary" className="w-fit">
              {duration} hour{duration !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              autoFocus
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the electrical work needed..."
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!customerName.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}