import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Target, Lightbulb, CheckCircle, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface AICoachPageProps {
  tasks: Task[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const basketballQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How many players are on the court for each team during a basketball game?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    explanation: "Each team has 5 players on the court at any given time during a basketball game."
  },
  {
    id: 2,
    question: "What is the height of a standard basketball hoop?",
    options: ["9 feet", "10 feet", "11 feet", "12 feet"],
    correctAnswer: 1,
    explanation: "A standard basketball hoop is 10 feet (3.05 meters) high from the ground."
  },
  {
    id: 3,
    question: "How many points is a free throw worth?",
    options: ["1 point", "2 points", "3 points", "4 points"],
    correctAnswer: 0,
    explanation: "A free throw is worth 1 point. It's an uncontested shot taken from the free-throw line."
  },
  {
    id: 4,
    question: "What does 'MVP' stand for in basketball?",
    options: ["Most Valuable Player", "Most Versatile Player", "Maximum Victory Points", "Major Victory Prize"],
    correctAnswer: 0,
    explanation: "MVP stands for Most Valuable Player, awarded to the best performing player in a season or tournament."
  },
  {
    id: 5,
    question: "How long is each quarter in an NBA game?",
    options: ["10 minutes", "12 minutes", "15 minutes", "20 minutes"],
    correctAnswer: 1,
    explanation: "Each quarter in an NBA game is 12 minutes long, making the total game time 48 minutes."
  },
  {
    id: 6,
    question: "What is a 'triple-double' in basketball?",
    options: ["Scoring 30+ points", "Three consecutive wins", "Double digits in three statistical categories", "Three 3-pointers in a row"],
    correctAnswer: 2,
    explanation: "A triple-double occurs when a player achieves double digits (10+) in three of the five major statistical categories: points, rebounds, assists, steals, or blocks."
  },
  {
    id: 7,
    question: "Which team won the first NBA championship?",
    options: ["Boston Celtics", "Philadelphia Warriors", "New York Knicks", "Minneapolis Lakers"],
    correctAnswer: 1,
    explanation: "The Philadelphia Warriors won the first NBA championship in 1947, defeating the Chicago Stags."
  }
];

const AICoachPage: React.FC<AICoachPageProps> = ({ tasks }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  useEffect(() => {
    // Load a random question on component mount
    loadRandomQuestion();
  }, []);

  const loadRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * basketballQuestions.length);
    setCurrentQuestion(basketballQuestions[randomIndex]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setShowResult(true);
    setQuestionsAnswered(prev => prev + 1);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (questionsAnswered >= 5) {
      setQuizCompleted(true);
    } else {
      loadRandomQuestion();
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setQuizCompleted(false);
    loadRandomQuestion();
  };

  const generateAISuggestions = () => {
    setIsGeneratingSuggestions(true);
    
    // Simulate AI analysis of tasks
    setTimeout(() => {
      const pendingTasks = tasks.filter(task => !task.completed && task.status === 'pending');
      const overdueTasks = tasks.filter(task => {
        const now = new Date();
        const dueDateTime = new Date(task.dueDate);
        const [hours, minutes] = task.dueTime.split(':');
        dueDateTime.setHours(parseInt(hours), parseInt(minutes));
        return now > dueDateTime && !task.completed;
      });

      const suggestions = [];

      if (overdueTasks.length > 0) {
        suggestions.push(`🚨 Priority Alert: You have ${overdueTasks.length} overdue task(s). Consider breaking them into smaller, manageable chunks to regain momentum.`);
      }

      if (pendingTasks.length > 5) {
        suggestions.push(`📊 Task Load Analysis: You have ${pendingTasks.length} pending tasks. Try the "2-minute rule" - if a task takes less than 2 minutes, do it immediately.`);
      }

      const hardTasks = pendingTasks.filter(task => task.difficulty === '3-pointer' || task.difficulty === '4-pointer');
      if (hardTasks.length > 0) {
        suggestions.push(`💪 Challenge Strategy: You have ${hardTasks.length} high-difficulty task(s). Schedule these during your peak energy hours for maximum success.`);
      }

      const workTasks = pendingTasks.filter(task => task.category === 'Work');
      const personalTasks = pendingTasks.filter(task => task.category === 'Personal');
      
      if (workTasks.length > personalTasks.length * 2) {
        suggestions.push(`⚖️ Work-Life Balance: Your work tasks outnumber personal tasks significantly. Consider adding some self-care or personal development tasks.`);
      }

      if (suggestions.length === 0) {
        suggestions.push(`🎯 Performance Insight: Great job maintaining a balanced task load! Consider setting stretch goals to challenge yourself further.`);
        suggestions.push(`🏆 Productivity Tip: Try time-blocking your calendar to dedicate specific hours to different types of tasks for improved focus.`);
      }

      // Add general productivity suggestions
      suggestions.push(`🧠 Cognitive Load Tip: Group similar tasks together (batch processing) to reduce mental switching costs and increase efficiency.`);
      suggestions.push(`⏰ Time Management: Use the Pomodoro Technique - work for 25 minutes, then take a 5-minute break to maintain peak performance.`);

      setAiSuggestions(suggestions.slice(0, 4)); // Show max 4 suggestions
      setIsGeneratingSuggestions(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 pb-24">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Coach</h1>
        <p className="text-white/80">Your personal productivity mentor</p>
      </div>

      {/* Daily Basketball Quiz */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Daily Basketball Quiz</h3>
        </div>

        {!quizCompleted ? (
          <>
            {currentQuestion && (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/80 text-sm">Question {questionsAnswered + 1} of 5</span>
                    <span className="text-white/80 text-sm">Score: {score}/{questionsAnswered}</span>
                  </div>
                  <h4 className="text-white font-medium text-lg mb-4">{currentQuestion.question}</h4>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`p-3 rounded-xl text-left transition-all duration-300 ${
                          showResult
                            ? index === currentQuestion.correctAnswer
                              ? 'bg-green-500/30 border-2 border-green-400 text-green-100'
                              : index === selectedAnswer && index !== currentQuestion.correctAnswer
                              ? 'bg-red-500/30 border-2 border-red-400 text-red-100'
                              : 'bg-white/10 text-white/60'
                            : selectedAnswer === index
                            ? 'bg-blue-500/30 border-2 border-blue-400 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                          {showResult && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                          )}
                          {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <div className="mt-4 p-4 bg-white/10 rounded-xl">
                      <p className="text-white/90 text-sm">
                        <strong>Explanation:</strong> {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-3">
                  {!showResult ? (
                    <button
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      {questionsAnswered >= 5 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">
              {score >= 4 ? '🏆' : score >= 3 ? '🥈' : score >= 2 ? '🥉' : '📚'}
            </div>
            <h4 className="text-2xl font-bold text-white">Quiz Complete!</h4>
            <p className="text-white/80 text-lg">
              You scored {score} out of 5 questions correctly!
            </p>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-white/90">
                {score >= 4 ? "Outstanding! You're a basketball knowledge champion!" :
                 score >= 3 ? "Great job! You have solid basketball knowledge!" :
                 score >= 2 ? "Good effort! Keep learning about the game!" :
                 "Keep studying! Every champion starts somewhere!"}
              </p>
            </div>
            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Take Quiz Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Smart Task Completion Suggestions */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-semibold text-white">Smart Task Analysis</h3>
          </div>
          <button
            onClick={generateAISuggestions}
            disabled={isGeneratingSuggestions}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
          >
            {isGeneratingSuggestions ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isGeneratingSuggestions ? 'Analyzing...' : 'Analyze Tasks'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="text-white font-medium mb-2">🤖 AI-Powered Productivity Insights</h4>
            <p className="text-white/80 text-sm mb-3">
              Our AI coach analyzes your task patterns, deadlines, and completion rates to provide personalized recommendations for optimal productivity.
            </p>
            
            {tasks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{tasks.length}</div>
                    <div className="text-white/70 text-sm">Total Tasks</div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {tasks.filter(t => t.completed).length}
                    </div>
                    <div className="text-white/70 text-sm">Completed</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Target className="w-12 h-12 text-white/40 mx-auto mb-2" />
                <p className="text-white/60">Add some tasks to get personalized AI insights!</p>
              </div>
            )}
          </div>

          {aiSuggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-medium">💡 Personalized Recommendations</h4>
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/90 text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          )}

          {aiSuggestions.length === 0 && !isGeneratingSuggestions && (
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-white/70 text-sm">
                Click "Analyze Tasks" to get AI-powered insights about your productivity patterns and personalized suggestions for improvement.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
          <h4 className="text-white font-medium mb-2">🔮 Future AI Features</h4>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Real-time task difficulty adjustment based on performance</li>
            <li>• Predictive deadline management with smart notifications</li>
            <li>• Personalized motivation messages based on your progress</li>
            <li>• Integration with OpenAI for advanced task optimization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AICoachPage;