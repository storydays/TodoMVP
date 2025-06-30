import { useState, useEffect } from 'react';
import { Task, GameStats, Badge, WeeklyChallenge } from '../types';

const DIFFICULTY_POINTS = {
  easy: 2,
  medium: 5,
  hard: 10
};

const INITIAL_BADGES: Badge[] = [
  { id: '1', name: 'First Bucket', description: 'Complete your first task', icon: '🏀', earned: false },
  { id: '2', name: 'Triple Double', description: 'Complete 10 tasks in a day', icon: '🔥', earned: false },
  { id: '3', name: 'Championship', description: 'Reach 100 total points', icon: '🏆', earned: false },
  { id: '4', name: 'MVP', description: 'Complete 7 days in a row', icon: '👑', earned: false },
];

export const useGameState = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPoints: 0,
    tasksCompleted: 0,
    currentStreak: 0,
    quarterProgress: 0,
    weeklyGoal: 40,
    badges: INITIAL_BADGES
  });

  const [challenges] = useState<WeeklyChallenge[]>([
    {
      id: '1',
      title: 'Full Court Press',
      description: 'Complete 15 tasks this week',
      target: 15,
      current: 0,
      reward: 50,
      active: true
    },
    {
      id: '2',
      title: 'Clutch Performer',
      description: 'Complete 3 hard tasks',
      target: 3,
      current: 0,
      reward: 30,
      active: true
    }
  ]);

  const addTask = (title: string, description: string, difficulty: 'easy' | 'medium' | 'hard', category: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      difficulty,
      points: DIFFICULTY_POINTS[difficulty],
      completed: false,
      createdAt: new Date(),
      category,
      priority: false
    };
    setTasks(prev => [...prev, newTask]);
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        const completedTask = { ...task, completed: true, completedAt: new Date() };
        
        // Update game stats
        setGameStats(prevStats => {
          const newStats = {
            ...prevStats,
            totalPoints: prevStats.totalPoints + task.points,
            tasksCompleted: prevStats.tasksCompleted + 1,
            quarterProgress: Math.min(prevStats.quarterProgress + 1, 10)
          };

          // Check for badge achievements
          const updatedBadges = newStats.badges.map(badge => {
            if (!badge.earned) {
              if (badge.id === '1' && newStats.tasksCompleted >= 1) {
                return { ...badge, earned: true, earnedAt: new Date() };
              }
              if (badge.id === '3' && newStats.totalPoints >= 100) {
                return { ...badge, earned: true, earnedAt: new Date() };
              }
            }
            return badge;
          });

          return { ...newStats, badges: updatedBadges };
        });

        return completedTask;
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const togglePriority = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, priority: !task.priority } : task
    ));
  };

  const getStartingFive = () => {
    return tasks.filter(task => task.priority && !task.completed).slice(0, 5);
  };

  const getTodaysTasks = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => task.createdAt.toDateString() === today);
  };

  return {
    tasks,
    gameStats,
    challenges,
    addTask,
    completeTask,
    deleteTask,
    togglePriority,
    getStartingFive,
    getTodaysTasks
  };
};