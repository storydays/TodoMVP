import React, { useState } from 'react';
import { Plus, Trophy, Target, Zap, Star, Calendar } from 'lucide-react';
import { Task, GameStats } from '../types';
import TaskCard from './TaskCard';
import QuickAddModal from './QuickAddModal';

interface TheCourtHomeProps {
  tasks: Task[];
  gameStats: GameStats;
  startingFive: Task[];
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onTogglePriority: (taskId: string) => void;
  onAddTask: (title: string, description: string, difficulty: 'easy' | 'medium' | 'hard', category: string) => void;
}

const TheCourtHome: React.FC<TheCourtHomeProps> = ({
  tasks,
  gameStats,
  startingFive,
  onCompleteTask,
  onDeleteTask,
  onTogglePriority,
  onAddTask
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const todaysTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    return task.createdAt.toDateString() === today && !task.completed;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full mb-4">
          <div className="text-2xl">⏸️</div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">The Court</h1>
        <p className="text-white/80">Ready to dominate your day?</p>
      </div>

      {/* Score Display */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Today's Score</h2>
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-1">
              <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center backdrop-blur-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{gameStats.quarterProgress}</div>
                  <div className="text-sm text-white/80">/10</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Points</span>
            </div>
            <div className="text-2xl font-bold text-white">{gameStats.totalPoints}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-white">{gameStats.tasksCompleted}</div>
          </div>
        </div>
      </div>

      {/* Starting Five */}
      {startingFive.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">Starting 5</h3>
          </div>
          <div className="space-y-3">
            {startingFive.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onDelete={onDeleteTask}
                onTogglePriority={onTogglePriority}
              />
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      {todaysTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Today's Game Plan</h3>
          </div>
          <div className="space-y-3">
            {todaysTasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onDelete={onDeleteTask}
                onTogglePriority={onTogglePriority}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => setShowQuickAdd(true)}
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full p-4 shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-lg"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-24 right-6">
        <div className="bg-white/20 backdrop-blur-lg rounded-full p-3 border border-white/30">
          <Zap className="w-6 h-6 text-yellow-400" />
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddModal
          onClose={() => setShowQuickAdd(false)}
          onAddTask={onAddTask}
        />
      )}
    </div>
  );
};

export default TheCourtHome;