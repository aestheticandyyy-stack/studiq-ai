import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Brain, LayoutGrid, GraduationCap, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import StudyAI from './components/StudyAI';
import Quiz from './components/Quiz';
import Flashcards from './components/Flashcards';
import Auth from './components/Auth';
import { Tab, User } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [studyContext, setStudyContext] = useState<string>('');
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('studiq_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse stored user session", e);
      }
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isStudyMode) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isStudyMode]);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('studiq_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('studiq_user');
  };

  const renderContent = () => {
    if (!user) return <Auth onLogin={handleLogin} />;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          isStudyMode={isStudyMode} 
          setIsStudyMode={setIsStudyMode} 
          timer={timer} 
        />;
      case 'ai':
        return <StudyAI 
          context={studyContext} 
          setContext={setStudyContext} 
          isLoggedIn={!!user}
        />;
      case 'quiz':
        return <Quiz context={studyContext} />;
      case 'flashcards':
        return <Flashcards context={studyContext} />;
      default:
        return <Dashboard 
          isStudyMode={isStudyMode} 
          setIsStudyMode={setIsStudyMode} 
          timer={timer} 
        />;
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#030712] selection:bg-blue-500/30">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-lg border-b border-gray-800/50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Studiq AI</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user.name}</span>
              <span className="text-xs text-gray-400">Level 5 Student</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </header>

      <main className="pt-24 px-4 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (user ? 'in' : 'out')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {user && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111827]/90 backdrop-blur-xl border border-gray-800 px-2 py-2 rounded-2xl flex items-center gap-1 shadow-2xl z-50">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<Home size={22} />} 
            label="Home" 
          />
          <NavButton 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
            icon={<Brain size={22} />} 
            label="Study AI" 
          />
          <NavButton 
            active={activeTab === 'quiz'} 
            onClick={() => setActiveTab('quiz')} 
            icon={<LayoutGrid size={22} />} 
            label="Quiz" 
          />
          <NavButton 
            active={activeTab === 'flashcards'} 
            onClick={() => setActiveTab('flashcards')} 
            icon={<GraduationCap size={22} />} 
            label="Cards" 
          />
        </nav>
      )}
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
    }`}
  >
    {icon}
    <span className={`text-sm font-semibold ${active ? 'block' : 'hidden md:block'}`}>{label}</span>
  </button>
);

export default App;