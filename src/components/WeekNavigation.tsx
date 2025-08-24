'use client';

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
    <div className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-6">
        <button
          onClick={goToPreviousWeek}
          disabled={isPastWeek()}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-2xl shadow-xl shadow-gray-700/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-gray-700 disabled:hover:to-gray-800 transform hover:scale-105 active:scale-95"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            {formatWeekRange(currentWeek)}
          </h2>
          <p className="text-lg font-bold text-gray-600">
            {isCurrentWeek() ? 'This Week' : 'Week of'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {!isCurrentWeek() && (
          <button
            onClick={goToCurrentWeek}
            className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105 active:scale-95"
          >
            Today
          </button>
        )}
        
        <button
          onClick={goToNextWeek}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-2xl shadow-xl shadow-gray-700/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}