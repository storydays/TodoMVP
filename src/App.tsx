import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import TheCourtHome from './components/TheCourtHome';
import StatsPage from './components/StatsPage';
import CalendarPage from './components/CalendarPage';
import AICoachPage from './components/AICoachPage';
import Navigation from './components/Navigation';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const {
    tasks,
    gameStats,
    challenges,
    addTask,
    completeTask,
    deleteTask,
    togglePriority,
    getStartingFive,
  } = useGameState();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <TheCourtHome
            tasks={tasks}
            gameStats={gameStats}
            startingFive={getStartingFive()}
            onCompleteTask={completeTask}
            onDeleteTask={deleteTask}
            onTogglePriority={togglePriority}
            onAddTask={addTask}
          />
        );
      case 'stats':
        return (
          <StatsPage
            gameStats={gameStats}
            tasks={tasks}
            challenges={challenges}
          />
        );
      case 'calendar':
        return <CalendarPage tasks={tasks} />;
      case 'settings':
        return <AICoachPage tasks={tasks} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentPage()}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}

export default App;