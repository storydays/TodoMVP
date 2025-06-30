import React from 'react';
import { Home, BarChart3, Calendar, Brain } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'The Court' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'calendar', icon: Calendar, label: 'Schedule' },
    { id: 'settings', icon: Brain, label: 'AI Coach' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 px-4 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;