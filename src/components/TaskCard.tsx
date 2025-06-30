import React, { useState } from 'react';
import { Check, Star, Trash2, Clock, Calendar, X } from 'lucide-react';
import { Task } from '../types';
import { playTaskCompletionCommentary, playFireworkSound } from '../utils/audio';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onTogglePriority: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, onTogglePriority }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    
    // Show fireworks animation
    setShowFireworks(true);
    
    // Play firework sound effect
    playFireworkSound();
    
    // Play voice commentary
    playTaskCompletionCommentary(task.title, task.difficulty, task.points);
    
    setTimeout(() => {
      onComplete(task.id);
      setShowFireworks(false);
    }, 2500); // Extended duration for enhanced animation
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '1-pointer': return 'from-green-400 to-green-600';
      case '2-pointer': return 'from-yellow-400 to-orange-500';
      case '3-pointer': return 'from-red-400 to-red-600';
      case '4-pointer': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case '1-pointer': return '🏀';
      case '2-pointer': return '⚡';
      case '3-pointer': return '🔥';
      case '4-pointer': return '💎';
      default: return '📝';
    }
  };

  const formatDueDateTime = () => {
    const dueDate = new Date(task.dueDate);
    const dateStr = dueDate.toLocaleDateString();
    return `${dateStr} at ${task.dueTime}`;
  };

  const isOverdue = () => {
    const now = new Date();
    const dueDateTime = new Date(task.dueDate);
    const [hours, minutes] = task.dueTime.split(':');
    dueDateTime.setHours(parseInt(hours), parseInt(minutes));
    return now > dueDateTime && !task.completed;
  };

  return (
    <div className={`relative bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20 transform transition-all duration-300 ${
      isCompleting ? 'scale-95 opacity-50' : 'hover:scale-105'
    } ${task.completed ? 'opacity-60' : ''} ${isOverdue() ? 'border-red-400/50' : ''}`}>
      
      {/* Enhanced Fireworks Animation */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden">
          {/* Central Burst - Large explosion effect */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full animate-ping transform -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2 opacity-70" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 rounded-full animate-bounce transform -translate-x-1/2 -translate-y-1/2 opacity-90" style={{ animationDelay: '0.4s' }}></div>
          
          {/* Large Corner Bursts */}
          <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-80"></div>
          <div className="absolute top-2 right-2 w-10 h-10 bg-red-400 rounded-full animate-bounce opacity-75" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-blue-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full animate-ping opacity-85" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Medium Scattered Particles */}
          <div className="absolute top-6 left-8 w-6 h-6 bg-purple-400 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-8 right-8 w-4 h-4 bg-orange-400 rounded-full animate-ping opacity-90" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-8 left-12 w-5 h-5 bg-pink-400 rounded-full animate-pulse opacity-75" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute bottom-6 right-12 w-7 h-7 bg-cyan-400 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.8s' }}></div>
          
          {/* Small Sparkle Effects - Dense Coverage */}
          <div className="absolute top-4 left-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-90" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute top-8 left-1/3 w-2 h-2 bg-pink-300 rounded-full animate-pulse opacity-85" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-12 left-2/3 w-4 h-4 bg-cyan-300 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-6 right-1/4 w-3 h-3 bg-orange-300 rounded-full animate-ping opacity-90" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute top-10 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-85" style={{ animationDelay: '0.9s' }}></div>
          
          <div className="absolute bottom-4 left-1/4 w-3 h-3 bg-green-300 rounded-full animate-bounce opacity-90" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-8 left-1/3 w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-80" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-12 left-2/3 w-2 h-2 bg-red-300 rounded-full animate-pulse opacity-85" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute bottom-6 right-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-bounce opacity-90" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute bottom-10 right-1/3 w-5 h-5 bg-pink-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.0s' }}></div>
          
          {/* Mid-level Particles */}
          <div className="absolute top-1/3 left-6 w-4 h-4 bg-indigo-400 rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/3 right-6 w-6 h-6 bg-emerald-400 rounded-full animate-bounce opacity-75" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-2/3 left-6 w-5 h-5 bg-rose-400 rounded-full animate-ping opacity-85" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute top-2/3 right-6 w-3 h-3 bg-amber-400 rounded-full animate-pulse opacity-90" style={{ animationDelay: '0.9s' }}></div>
          
          {/* Edge Sparkles for Flourish Effect */}
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full animate-ping opacity-95 transform -translate-x-1/2" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white rounded-full animate-bounce opacity-90 transform -translate-x-1/2" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute top-1/2 left-0 w-2 h-2 bg-white rounded-full animate-pulse opacity-95 transform -translate-y-1/2" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-1/2 right-0 w-3 h-3 bg-white rounded-full animate-ping opacity-90 transform -translate-y-1/2" style={{ animationDelay: '1.0s' }}></div>
          
          {/* Radiating Lines Effect */}
          <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-transparent via-yellow-400 to-transparent animate-pulse transform -translate-x-1/2 -translate-y-1/2 rotate-0 opacity-60" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-transparent via-red-400 to-transparent animate-pulse transform -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-60" style={{ animationDelay: '0.4s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-transparent via-blue-400 to-transparent animate-pulse transform -translate-x-1/2 -translate-y-1/2 rotate-90 opacity-60" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-transparent via-green-400 to-transparent animate-pulse transform -translate-x-1/2 -translate-y-1/2 rotate-135 opacity-60" style={{ animationDelay: '0.8s' }}></div>
          
          {/* Outer Ring Particles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-violet-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-teal-400 rounded-full animate-ping opacity-80" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-fuchsia-400 rounded-full animate-pulse opacity-75" style={{ animationDelay: '0.9s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-lime-400 rounded-full animate-bounce opacity-85" style={{ animationDelay: '1.1s' }}></div>
          
          {/* Burst Effect Overlay with Multiple Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-red-400/30 to-blue-400/30 animate-pulse rounded-2xl opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-green-400/20 via-purple-400/20 to-pink-400/20 animate-pulse rounded-2xl opacity-70" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-orange-400/25 via-cyan-400/25 to-violet-400/25 animate-pulse rounded-2xl opacity-60" style={{ animationDelay: '0.6s' }}></div>
        </div>
      )}
      
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{getDifficultyIcon(task.difficulty)}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(task.difficulty)} text-white`}>
              {task.difficulty.toUpperCase()}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/20 text-white">
              +{task.points} pts
            </span>
            {task.status === 'uncompleted' && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                FAILED
              </span>
            )}
          </div>
          <h4 className="font-semibold text-white text-lg leading-tight">{task.title}</h4>
          {task.description && (
            <p className="text-white/70 text-sm mt-1">{task.description}</p>
          )}
        </div>
        
        <button
          onClick={() => onTogglePriority(task.id)}
          className={`p-2 rounded-full transition-colors ${
            task.priority 
              ? 'bg-yellow-400 text-yellow-900' 
              : 'bg-white/20 text-white/60 hover:bg-white/30'
          }`}
        >
          <Star className={`w-4 h-4 ${task.priority ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Task Details */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4 text-white/60 text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center space-x-1 text-sm ${isOverdue() ? 'text-red-400' : 'text-white/60'}`}>
          <Clock className="w-4 h-4" />
          <span>Due: {formatDueDateTime()}</span>
          {isOverdue() && <span className="text-red-400 font-medium">(Overdue)</span>}
        </div>
      </div>

      {/* Task Actions */}
      <div className="flex items-center justify-between">
        <div className="text-white/60 text-sm">
          <span className="capitalize">{task.category}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!task.completed && task.status === 'pending' && (
            <>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50"
              >
                {isCompleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{isCompleting ? 'Scoring...' : 'Complete'}</span>
              </button>
            </>
          )}
          
          {task.completed && (
            <div className="flex items-center space-x-2 text-green-400">
              <Check className="w-5 h-5" />
              <span className="font-medium">Scored!</span>
            </div>
          )}

          {task.status === 'uncompleted' && (
            <div className="flex items-center space-x-2 text-red-400">
              <X className="w-5 h-5" />
              <span className="font-medium">Failed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;