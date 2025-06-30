import React, { useState, useEffect } from 'react';
import { X, Mic, Target, Sparkles } from 'lucide-react';

interface QuickAddModalProps {
  onClose: () => void;
  onAddTask: (title: string, difficulty: '1-pointer' | '2-pointer' | '3-pointer' | '4-pointer', category: string, dueDate: Date, dueTime: string) => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'1-pointer' | '2-pointer' | '3-pointer' | '4-pointer'>('2-pointer');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Set default due date to today
    const today = new Date();
    setDueDate(today.toISOString().split('T')[0]);
    
    // Set default due time to current time + 1 hour
    const defaultTime = new Date(today.getTime() + 60 * 60 * 1000);
    setDueTime(defaultTime.toTimeString().slice(0, 5));

    // Load available voices
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && dueDate && dueTime) {
      const taskDueDate = new Date(dueDate);
      onAddTask(title, difficulty, category, taskDueDate, dueTime);
      
      // Play voice commentary
      playVoiceCommentary();
      
      onClose();
    }
  };

  const playVoiceCommentary = () => {
    if ('speechSynthesis' in window) {
      const commentaries = [
        `Great play! ${title} has been added to the playbook with ${difficulty} difficulty!`,
        `Excellent strategy! New ${difficulty} task "${title}" is now in your game plan!`,
        `Outstanding! You've just added a ${difficulty} challenge to dominate!`,
        `Perfect execution! ${title} is locked and loaded for victory!`
      ];

      const randomCommentary = commentaries[Math.floor(Math.random() * commentaries.length)];
      const utterance = new SpeechSynthesisUtterance(randomCommentary);
      
      // Try to use different voices (male/female alternation)
      const maleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('david') ||
        voice.name.toLowerCase().includes('mark')
      );
      const femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      );

      const useRandomVoice = Math.random() > 0.5;
      if (useRandomVoice && maleVoices.length > 0) {
        utterance.voice = maleVoices[0];
      } else if (femaleVoices.length > 0) {
        utterance.voice = femaleVoices[0];
      }

      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTitle(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Fallback simulation
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setTitle("Complete workout routine");
      }, 2000);
    }
  };

  const handleAITaskSuggestion = () => {
    setIsAIGenerating(true);
    
    // Simulate AI task generation (replace with actual OpenAI API call)
    setTimeout(() => {
      const aiSuggestions = [
        { title: "Review quarterly financial reports", difficulty: "3-pointer" as const, category: "Work" },
        { title: "Complete 30-minute cardio workout", difficulty: "2-pointer" as const, category: "Health" },
        { title: "Read 20 pages of leadership book", difficulty: "2-pointer" as const, category: "Education" },
        { title: "Organize digital photo collection", difficulty: "4-pointer" as const, category: "Personal" },
        { title: "Update investment portfolio", difficulty: "3-pointer" as const, category: "Finance" }
      ];

      const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
      
      setTitle(randomSuggestion.title);
      setDifficulty(randomSuggestion.difficulty);
      setCategory(randomSuggestion.category);
      
      // Set due date based on difficulty
      const today = new Date();
      const daysToAdd = randomSuggestion.difficulty === '1-pointer' ? 1 : 
                      randomSuggestion.difficulty === '2-pointer' ? 2 :
                      randomSuggestion.difficulty === '3-pointer' ? 3 : 5;
      
      const suggestedDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      setDueDate(suggestedDate.toISOString().split('T')[0]);
      
      // Set due time based on category
      const timeMap: { [key: string]: string } = {
        'Work': '17:00',
        'Health': '07:00',
        'Education': '20:00',
        'Personal': '19:00',
        'Finance': '18:00'
      };
      setDueTime(timeMap[randomSuggestion.category] || '18:00');
      
      setIsAIGenerating(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md border border-white/20 max-h-[90vh] overflow-y-auto">
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
            <label className="block text-white/80 text-sm font-medium mb-2">Name of the task</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="What's your next play?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={handleAITaskSuggestion}
                disabled={isAIGenerating}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
              >
                {isAIGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="text-sm">AI Task</span>
              </button>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Shot Difficulty</label>
            <div className="grid grid-cols-2 gap-2">
              {(['1-pointer', '2-pointer', '3-pointer', '4-pointer'] as const).map((diff) => (
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
                  {diff === '1-pointer' && '🏀'} 
                  {diff === '2-pointer' && '⚡'} 
                  {diff === '3-pointer' && '🔥'} 
                  {diff === '4-pointer' && '💎'}
                  <div className="text-xs mt-1">{diff}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
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

          {/* Date and Time Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 backdrop-blur-sm"
                required
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Due Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !dueDate || !dueTime}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Playbook
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;