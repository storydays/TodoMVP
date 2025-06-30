import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Task } from '../types';

interface CalendarPageProps {
  tasks: Task[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getActivityLevel = (date: Date) => {
    const dayTasks = getTasksForDate(date);
    const completedTasks = dayTasks.filter(task => task.completed);
    
    if (dayTasks.length === 0) return 0;
    const ratio = completedTasks.length / dayTasks.length;
    
    if (ratio >= 0.8) return 4; // High activity
    if (ratio >= 0.6) return 3; // Medium-high activity
    if (ratio >= 0.4) return 2; // Medium activity
    if (ratio > 0) return 1; // Low activity
    return 0; // No activity
  };

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-white/10';
      case 1: return 'bg-blue-400/30';
      case 2: return 'bg-blue-400/50';
      case 3: return 'bg-blue-400/70';
      case 4: return 'bg-blue-400';
      default: return 'bg-white/10';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 pb-24">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full mb-4">
          <Calendar className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Game Schedule</h1>
        <p className="text-white/80">Track your daily performance</p>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white">{monthName}</h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-white/60 text-sm font-medium p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDay }, (_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = date.toDateString() === new Date().toDateString();
            const activityLevel = getActivityLevel(date);
            const dayTasks = getTasksForDate(date);
            
            return (
              <div
                key={day}
                className={`relative p-2 rounded-lg transition-all duration-300 ${
                  isToday 
                    ? 'bg-white/30 border-2 border-white' 
                    : `${getActivityColor(activityLevel)} hover:bg-white/20`
                }`}
              >
                <div className="text-center">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-white font-bold' : 'text-white/80'
                  }`}>
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Legend */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Activity Heatmap</h3>
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-4 h-4 rounded ${getActivityColor(level)}`}
              ></div>
            ))}
          </div>
          <span className="text-white/60 text-sm">More</span>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Today's Game</h3>
        </div>
        
        {(() => {
          const todayTasks = getTasksForDate(new Date());
          const completedToday = todayTasks.filter(task => task.completed);
          
          if (todayTasks.length === 0) {
            return (
              <p className="text-white/60">No tasks scheduled for today. Ready to add some plays?</p>
            );
          }
          
          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Tasks completed</span>
                <span className="text-white font-bold">{completedToday.length}/{todayTasks.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedToday.length / todayTasks.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-white/60 text-sm">
                  {completedToday.length === todayTasks.length 
                    ? "Perfect game! All tasks completed! 🏆" 
                    : `${todayTasks.length - completedToday.length} tasks remaining`
                  }
                </span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default CalendarPage;