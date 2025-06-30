import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Target, Zap, Star, Calendar, Mic, MicOff } from 'lucide-react';
import { Task, GameStats } from '../types';
import TaskCard from './TaskCard';
import QuickAddModal from './QuickAddModal';
import EnhancedFireworks from './EnhancedFireworks';

interface TheCourtHomeProps {
  tasks: Task[];
  gameStats: GameStats;
  startingFive: Task[];
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onTogglePriority: (taskId: string) => void;
  onAddTask: (title: string, difficulty: '1-pointer' | '2-pointer' | '3-pointer' | '4-pointer', category: string, dueDate: Date, dueTime: string) => void;
}

const motivationalQuotes = [
  "I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed. - Michael Jordan",
  "The strength of the team is each individual member. The strength of each member is the team. - Phil Jackson",
  "Champions keep playing until they get it right. - Billie Jean King",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "Hard work beats talent when talent doesn't work hard. - Tim Notke",
  "The only way to prove that you're a good sport is to lose. - Ernie Banks",
  "Excellence is not a skill, it's an attitude. - Ralph Marston"
];

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
  const [isVoiceCommandOn, setIsVoiceCommandOn] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [fireworksDisplay, setFireworksDisplay] = useState<{
    show: boolean;
    message: string;
    taskId: string | null;
    intensity: 'small' | 'medium' | 'large' | 'epic';
    particleImages: string[];
  }>({
    show: false,
    message: '',
    taskId: null,
    intensity: 'medium',
    particleImages: []
  });

  // Basketball-themed firework images
  const basketballFireworkImages = [
    '/medal.png',
    '/basketball-player.png',
    '/trophyv4.png',
    '/Glowbb.png',
    '/icons8-basketball-64.png'
  ];

  useEffect(() => {
    // Set a random motivational quote on component mount
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const handleTriggerFireworks = (taskId: string, message: string) => {
    // Find the task to determine intensity based on difficulty
    const task = tasks.find(t => t.id === taskId);
    let intensity: 'small' | 'medium' | 'large' | 'epic' = 'medium';
    
    if (task) {
      switch (task.difficulty) {
        case '1-pointer':
          intensity = 'small';
          break;
        case '2-pointer':
          intensity = 'medium';
          break;
        case '3-pointer':
          intensity = 'large';
          break;
        case '4-pointer':
          intensity = 'epic';
          break;
      }
    }

    // Randomly select two distinct images from the basketball firework images
    const shuffled = [...basketballFireworkImages].sort(() => 0.5 - Math.random());
    const selectedImages = shuffled.slice(0, 2);

    setFireworksDisplay({
      show: true,
      message,
      taskId,
      intensity,
      particleImages: selectedImages
    });
  };

  const handleFireworksComplete = () => {
    if (fireworksDisplay.taskId) {
      onCompleteTask(fireworksDisplay.taskId);
    }
    setFireworksDisplay({
      show: false,
      message: '',
      taskId: null,
      intensity: 'medium',
      particleImages: []
    });
  };

  const todaysTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    return task.createdAt.toDateString() === today && !task.completed;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 pb-24 overflow-y-auto">
      {/* Fireworks Animation - Rendered at top level for full screen overlay */}
      {fireworksDisplay.show && (
        <EnhancedFireworks
          intensity={fireworksDisplay.intensity}
          message={fireworksDisplay.message}
          particleImages={fireworksDisplay.particleImages}
          onComplete={handleFireworksComplete}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full">
            <div className="text-2xl">🏀</div>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsVoiceCommandOn(!isVoiceCommandOn)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isVoiceCommandOn 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                  : 'bg-white/20 text-white/70 border border-white/30'
              }`}
            >
              {isVoiceCommandOn ? (
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4" />
                  <span>Voice On</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <MicOff className="w-4 h-4" />
                  <span>Voice Off</span>
                </div>
              )}
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">PPL - Productivity Performance League</h1>
        <p className="text-white/80">Ready to dominate your day?</p>
      </div>

      {/* Motivational Quote Panel */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-3">🏆 Champion's Wisdom</h3>
          <p className="text-white/90 text-sm italic leading-relaxed">
            "{currentQuote}"
          </p>
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Match Score</h2>
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-1">
              <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center backdrop-blur-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{gameStats.matchPoints}</div>
                  <div className="text-sm text-white/80">/40</div>
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
                onTriggerFireworks={handleTriggerFireworks}
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
                onTriggerFireworks={handleTriggerFireworks}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => setShowQuickAdd(true)}
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full p-4 shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-lg"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-32 right-6 z-40">
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