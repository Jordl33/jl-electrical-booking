'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DurationSelectorProps {
  duration: number;
  onDurationChange: (duration: number) => void;
}

export default function DurationSelector({ duration, onDurationChange }: DurationSelectorProps) {
  const [customValue, setCustomValue] = useState(duration.toString());

  const presetDurations = [1, 2, 3, 4, 6, 8];

  const handleCustomInput = (value: string) => {
    setCustomValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 8) {
      onDurationChange(numValue);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Job Duration</h3>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex flex-wrap gap-2">
          {presetDurations.map((preset) => (
            <Button
              key={preset}
              onClick={() => {
                onDurationChange(preset);
                setCustomValue(preset.toString());
              }}
              variant={duration === preset ? "default" : "outline"}
              size="sm"
            >
              {preset} hour{preset !== 1 ? 's' : ''}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <Label htmlFor="custom-duration" className="text-sm font-medium">
            Custom:
          </Label>
          <Input
            id="custom-duration"
            type="number"
            min="0.5"
            max="8"
            step="0.5"
            value={customValue}
            onChange={(e) => handleCustomInput(e.target.value)}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">hours</span>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm font-medium text-blue-900">
          Working Hours: 8:00 AM - 4:00 PM (Maximum 8 hours per day)
        </p>
        <p className="text-xs text-blue-700 mt-1">
          30-minute increments supported (e.g., 1.5 hours, 2.5 hours)
        </p>
      </div>
    </div>
  );
}