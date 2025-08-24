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
    <div className="flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-100 px-6 py-4 mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={goToPreviousWeek}
          disabled={isPastWeek()}
          className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {formatWeekRange(currentWeek)}
          </h2>
          <p className="text-sm text-gray-600">
            {isCurrentWeek() ? 'This Week' : 'Week of'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {!isCurrentWeek() && (
          <button
            onClick={goToCurrentWeek}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200"
          >
            Today
          </button>
        )}
        
        <button
          onClick={goToNextWeek}
          className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}