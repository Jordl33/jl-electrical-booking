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
    <div className="p-6">
      <h3 className="text-xl font-black text-gray-900 mb-4">Job Duration</h3>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex flex-wrap gap-3">
          {presetDurations.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                onDurationChange(preset);
                setCustomValue(preset.toString());
              }}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                duration === preset
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/30'
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 shadow-gray-300/30'
              }`}
            >
              {preset} hour{preset !== 1 ? 's' : ''}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 bg-gradient-to-br from-gray-700 to-gray-800 px-4 py-3 rounded-xl shadow-lg shadow-gray-700/30">
          <label htmlFor="custom-duration" className="text-sm font-bold text-white">
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
            className="w-20 px-3 py-2 text-sm font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-md transition-all duration-200"
          />
          <span className="text-sm font-bold text-white">hours</span>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
        <p className="text-sm font-bold text-white">
          Working Hours: 8:00 AM - 4:00 PM (Maximum 8 hours per day)
        </p>
        <p className="text-xs text-blue-100 mt-1 font-medium">
          30-minute increments supported (e.g., 1.5 hours, 2.5 hours)
        </p>
      </div>
    </div>
  );
}