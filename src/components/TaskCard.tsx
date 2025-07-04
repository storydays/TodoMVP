import React, { useState } from 'react';
import { Check, Star, Trash2, Clock, Calendar, X, FileText } from 'lucide-react';
import { Task } from '../types';
import { playTaskCompletionCommentary, playFireworkSound } from '../utils/audio';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onTogglePriority: (taskId: string) => void;
  onTriggerFireworks?: (taskId: string, message: string, celebrationImages: string[]) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onComplete, 
  onDelete, 
  onTogglePriority, 
  onTriggerFireworks 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    
    // Play firework sound effect
    playFireworkSound();
    
    // Play voice commentary
    playTaskCompletionCommentary(task.title, task.difficulty, task.points);
    
    // Trigger fireworks animation if callback is provided
    if (onTriggerFireworks) {
      const messages = [
        "Task Completed!",
        "Victory!",
        "Amazing Work!",
        "On Fire!",
        "Crushed It!",
        "Perfect Shot!",
        "Championship Play!",
        "MVP Performance!"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      // Define all available celebration images
      const availableImages = [
        '/medal.png',
        '/basketball-player.png', 
        '/trophyv4.png',
        '/Glowbb.png',
        '/icons8-basketball-64.png',
        '/BallandPlayer.png',
        '/Femaleplayer.png',
        '/Maleplayer.png',
        '/team.png',
        '/cup.png',
        '/icons8-trophy-64.png',
        '/Trophyv1.png',
        '/trophyv2.png',
        '/applogo.png',
        '/ballbasket.png',
        '/icons8-basketball-64 copy.png',
        '/icons8-basketball-100.png'
      ];
      
      // Randomly select two distinct images
      const shuffled = [...availableImages].sort(() => 0.5 - Math.random());
      const selectedImages = shuffled.slice(0, 2);
      
      onTriggerFireworks(task.id, randomMessage, selectedImages);
    } else {
      // Fallback if no fireworks callback provided
      setTimeout(() => {
        onComplete(task.id);
        setIsCompleting(false);
      }, 1000);
    }
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
          {task.notes && (
            <div className="mt-2 p-2 bg-white/10 rounded-lg">
              <div className="flex items-center space-x-1 mb-1">
                <FileText className="w-3 h-3 text-white/60" />
                <span className="text-xs text-white/60 font-medium">Notes:</span>
              </div>
              <p className="text-white/80 text-sm">{task.notes}</p>
            </div>
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
          {/* Removed category display since it's no longer part of the task */}
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