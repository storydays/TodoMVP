import React from 'react';
import { Trophy, Target, Calendar, TrendingUp, Award, Clock } from 'lucide-react';
import { GameStats, Task, WeeklyChallenge } from '../types';

interface StatsPageProps {
  gameStats: GameStats;
  tasks: Task[];
  challenges: WeeklyChallenge[];
}

const StatsPage: React.FC<StatsPageProps> = ({ gameStats, tasks, challenges }) => {
  const completedTasks = tasks.filter(task => task.completed);
  const thisWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return taskDate >= weekStart;
  });

  const getCompletionRate = () => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks.length / tasks.length) * 100);
  };

  const getWeeklyProgress = () => {
    const completed = thisWeekTasks.filter(task => task.completed).length;
    return Math.round((completed / gameStats.weeklyGoal) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Player Stats</h1>
        <p className="text-white/80">Your performance breakdown</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white/80 text-sm font-medium">Total Points</span>
          </div>
          <div className="text-2xl font-bold text-white">{gameStats.totalPoints}</div>
        </div>

        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-white/80 text-sm font-medium">Tasks Done</span>
          </div>
          <div className="text-2xl font-bold text-white">{gameStats.tasksCompleted}</div>
        </div>

        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-white/80 text-sm font-medium">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{getCompletionRate()}%</div>
        </div>

        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-white/80 text-sm font-medium">Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">{gameStats.currentStreak}</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Weekly Goal</h3>
          <span className="text-white/80 text-sm">{thisWeekTasks.filter(t => t.completed).length}/{gameStats.weeklyGoal}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(getWeeklyProgress(), 100)}%` }}
          ></div>
        </div>
        <p className="text-white/70 text-sm">{getWeeklyProgress()}% complete</p>
      </div>

      {/* Badges */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {gameStats.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                badge.earned
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <div className={`font-medium ${badge.earned ? 'text-yellow-400' : 'text-white/60'}`}>
                {badge.name}
              </div>
              <div className={`text-xs ${badge.earned ? 'text-yellow-300' : 'text-white/40'}`}>
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenges */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-6 h-6 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Weekly Challenges</h3>
        </div>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{challenge.title}</h4>
                <span className="text-orange-400 font-bold">+{challenge.reward} pts</span>
              </div>
              <p className="text-white/70 text-sm mb-3">{challenge.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-white/80 text-sm ml-3">
                  {challenge.current}/{challenge.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;