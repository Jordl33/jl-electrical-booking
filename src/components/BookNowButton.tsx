'use client';

import { formatTime } from '@/lib/bookingUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <Card className="w-80 shadow-lg animate-pulse">
        <CardHeader className="pb-3">
          <h3 className="font-semibold">Selected Time Slot</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="font-semibold text-blue-700">
              {selectedSlots.day}, {new Date(selectedSlots.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </div>
            <div className="font-medium">
              {formatTime(selectedSlots.startTimeIndex)} - {formatTime(endTimeIndex)}
            </div>
            <Badge variant="secondary" className="w-fit">
              {durationText}
            </Badge>
          </div>
          
          <Button onClick={onBook} className="w-full" size="lg">
            Book This Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}