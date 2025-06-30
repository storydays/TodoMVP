import React, { useState } from 'react';
import { X, Mic, Sparkles, Target } from 'lucide-react';

interface QuickAddModalProps {
  onClose: () => void;
  onAddTask: (title: string, description: string, difficulty: 'easy' | 'medium' | 'hard', category: string) => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [category, setCategory] = useState('Personal');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title, description, difficulty, category);
      onClose();
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      setIsListening(false);
      // Mock voice input result
      setTitle("Complete workout routine");
      setDescription("30 minute full body workout");
    }, 2000);
  };

  const quickTemplates = [
    { title: "Daily Workout", difficulty: "medium" as const, category: "Health", icon: "💪" },
    { title: "Study Session", difficulty: "hard" as const, category: "Education", icon: "📚" },
    { title: "Call Family", difficulty: "easy" as const, category: "Personal", icon: "📞" },
    { title: "Meal Prep", difficulty: "medium" as const, category: "Health", icon: "🍽️" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Play</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Input */}
        <div className="mb-6">
          <button
            onClick={handleVoiceInput}
            disabled={isListening}
            className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${
              isListening 
                ? 'border-orange-400 bg-orange-400/10 animate-pulse' 
                : 'border-white/30 bg-white/5 hover:border-white/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Mic className={`w-6 h-6 ${isListening ? 'text-orange-400' : 'text-white/70'}`} />
              <span className={`font-medium ${isListening ? 'text-orange-400' : 'text-white/70'}`}>
                {isListening ? 'Listening...' : 'Tap to speak your task'}
              </span>
            </div>
          </button>
        </div>

        {/* Manual Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="What's your next play?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 backdrop-blur-sm"
            />
          </div>

          <div>
            <textarea
              placeholder="Add details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 backdrop-blur-sm resize-none"
              rows={2}
            />
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Shot Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`p-3 rounded-xl font-medium transition-all ${
                    difficulty === diff
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {diff === 'easy' && '🏀'} {diff === 'medium' && '⚡'} {diff === 'hard' && '🔥'}
                  <div className="text-xs mt-1 capitalize">{diff}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 backdrop-blur-sm"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Court
          </button>
        </form>

        {/* Quick Templates */}
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/80 text-sm font-medium">Quick Plays</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => {
                  setTitle(template.title);
                  setDifficulty(template.difficulty);
                  setCategory(template.category);
                }}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors"
              >
                <div className="text-lg mb-1">{template.icon}</div>
                <div className="font-medium">{template.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;