'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekNavigationProps {
  currentWeek: Date;
  onWeekChange: (newWeek: Date) => void;
}

export default function WeekNavigation({ currentWeek, onWeekChange }: WeekNavigationProps) {
  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    onWeekChange(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    onWeekChange(newWeek);
  };

  const goToCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    onWeekChange(monday);
  };

  const formatWeekRange = (weekStart: Date): string => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // Friday
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: weekStart.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    
    return `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
  };

  const isCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() + mondayOffset);
    thisMonday.setHours(0, 0, 0, 0);
    
    return currentWeek.getTime() === thisMonday.getTime();
  };

  const isPastWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() + mondayOffset);
    thisMonday.setHours(0, 0, 0, 0);
    
    return currentWeek.getTime() < thisMonday.getTime();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          onClick={goToPreviousWeek}
          disabled={isPastWeek()}
          size="sm"
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {formatWeekRange(currentWeek)}
          </h2>
          <Badge variant="secondary" className="text-xs">
            {isCurrentWeek() ? 'This Week' : 'Week of'}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {!isCurrentWeek() && (
          <Button onClick={goToCurrentWeek} size="sm">
            Today
          </Button>
        )}
        
        <Button onClick={goToNextWeek} size="sm" variant="outline">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}