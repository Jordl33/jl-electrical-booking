'use client';

import { useState } from 'react';

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
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Job Duration</h3>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex flex-wrap gap-3">
          {presetDurations.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                onDurationChange(preset);
                setCustomValue(preset.toString());
              }}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                duration === preset
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-md'
              }`}
            >
              {preset} hour{preset !== 1 ? 's' : ''}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 rounded-xl border border-gray-200">
          <label htmlFor="custom-duration" className="text-sm font-medium text-gray-700">
            Custom:
          </label>
          <input
            id="custom-duration"
            type="number"
            min="0.5"
            max="8"
            step="0.5"
            value={customValue}
            onChange={(e) => handleCustomInput(e.target.value)}
            className="w-20 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
          <span className="text-sm font-medium text-gray-700">hours</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Working Hours:</span> 8:00 AM - 4:00 PM (Maximum 8 hours per day)
        </p>
        <p className="text-xs text-gray-600 mt-1">
          30-minute increments supported (e.g., 1.5 hours, 2.5 hours)
        </p>
      </div>
    </div>
  );
}