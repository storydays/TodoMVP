import { useState, useEffect } from 'react';
import { Task, GameStats, Badge, WeeklyChallenge } from '../types';

const DIFFICULTY_POINTS = {
  '1-pointer': 1,
  '2-pointer': 2,
  '3-pointer': 3,
  '4-pointer': 4
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
    matchPoints: 0,
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

  // Check for overdue tasks on component mount and periodically
  useEffect(() => {
    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkOverdueTasks = () => {
    const now = new Date();
    setTasks(prev => prev.map(task => {
      if (task.status === 'pending' && !task.completed) {
        const dueDateTime = new Date(task.dueDate);
        const [hours, minutes] = task.dueTime.split(':');
        dueDateTime.setHours(parseInt(hours), parseInt(minutes));
        
        const daysDiff = Math.floor((now.getTime() - dueDateTime.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 2) {
          return { ...task, status: 'uncompleted', points: 0 };
        }
      }
      return task;
    }));
  };

  const addTask = (
    title: string, 
    difficulty: '1-pointer' | '2-pointer' | '3-pointer' | '4-pointer', 
    notes: string,
    dueDate: Date,
    dueTime: string
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      difficulty,
      points: DIFFICULTY_POINTS[difficulty],
      completed: false,
      createdAt: new Date(),
      dueDate,
      dueTime,
      notes,
      priority: false,
      status: 'pending'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        const completedAt = new Date();
        const dueDateTime = new Date(task.dueDate);
        const [hours, minutes] = task.dueTime.split(':');
        dueDateTime.setHours(parseInt(hours), parseInt(minutes));
        
        const daysDiff = Math.floor((completedAt.getTime() - dueDateTime.getTime()) / (1000 * 60 * 60 * 24));
        
        let finalPoints = task.points;
        let status: 'completed' | 'uncompleted' = 'completed';
        
        if (daysDiff === 1) {
          finalPoints = Math.max(0, task.points - 1);
        } else if (daysDiff >= 2) {
          finalPoints = 0;
          status = 'uncompleted';
        }
        
        const completedTask = { 
          ...task, 
          completed: true, 
          completedAt,
          points: finalPoints,
          status
        };
        
        // Update game stats
        setGameStats(prevStats => {
          const newStats = {
            ...prevStats,
            totalPoints: prevStats.totalPoints + finalPoints,
            tasksCompleted: prevStats.tasksCompleted + 1,
            quarterProgress: Math.min(prevStats.quarterProgress + 1, 10),
            matchPoints: prevStats.matchPoints + finalPoints
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

  const getTasksByStatus = (status: 'pending' | 'completed' | 'uncompleted') => {
    return tasks.filter(task => task.status === status);
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
    getTodaysTasks,
    getTasksByStatus,
    checkOverdueTasks
  };
};