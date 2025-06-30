export interface Task {
  id: string;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  category: string;
  priority: boolean;
}

export interface GameStats {
  totalPoints: number;
  tasksCompleted: number;
  currentStreak: number;
  quarterProgress: number;
  weeklyGoal: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  active: boolean;
}