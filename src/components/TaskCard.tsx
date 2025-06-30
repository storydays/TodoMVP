import React, { useState } from 'react';
import { Check, Star, Trash2, Clock, Zap } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onTogglePriority: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, onTogglePriority }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete(task.id);
    }, 500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🏀';
      case 'medium': return '⚡';
      case 'hard': return '🔥';
      default: return '📝';
    }
  };

  return (
    <div className={`bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20 transform transition-all duration-300 ${
      isCompleting ? 'scale-95 opacity-50' : 'hover:scale-105'
    } ${task.completed ? 'opacity-60' : ''}`}>
      
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

      {/* Task Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white/60 text-sm">
          <Clock className="w-4 h-4" />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!task.completed && (
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
        </div>
      </div>
    </div>
  );
};

export default TaskCard;