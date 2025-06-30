export interface Task {
  id: string;
  title: string;
  description?: string;
  difficulty: '1-pointer' | '2-pointer' | '3-pointer' | '4-pointer';
  points: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  dueDate: Date;
  dueTime: string;
  notes?: string;
  priority: boolean;
  status: 'pending' | 'completed' | 'uncompleted';
}

export interface GameStats {
  totalPoints: number;
  tasksCompleted: number;
  currentStreak: number;
  quarterProgress: number;
  matchPoints: number;
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