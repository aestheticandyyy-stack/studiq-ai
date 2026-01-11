
import React from 'react';
import { motion } from 'framer-motion';
import { Power, Clock, Calendar, Trophy, Zap, Heart } from 'lucide-react';

interface DashboardProps {
  isStudyMode: boolean;
  setIsStudyMode: (val: boolean) => void;
  timer: number;
}

const Dashboard: React.FC<DashboardProps> = ({ isStudyMode, setIsStudyMode, timer }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col items-center text-center space-y-12">
      <header className="space-y-2">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Studiq AI</h2>
        <p className="text-gray-400 text-lg">Study smarter, not harder.</p>
      </header>

      {/* VPN Style Power Button */}
      <div className="relative group">
        <motion.div 
          animate={isStudyMode ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
            isStudyMode 
              ? 'border-blue-500 bg-blue-500/10 vpn-button-active shadow-[0_0_60px_rgba(59,130,246,0.5)]' 
              : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900 shadow-xl'
          }`}
          onClick={() => setIsStudyMode(!isStudyMode)}
        >
          <Power className={`w-16 h-16 mb-2 transition-colors duration-500 ${isStudyMode ? 'text-blue-400' : 'text-gray-600'}`} />
          <span className={`text-sm font-bold tracking-widest uppercase transition-colors duration-500 ${isStudyMode ? 'text-blue-400' : 'text-gray-500'}`}>
            {isStudyMode ? 'STAYING FOCUSED' : 'STUDY'}
          </span>
          {isStudyMode && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-2 text-xl font-mono text-white"
            >
              {formatTime(timer)}
            </motion.div>
          )}
        </motion.div>
        
        {/* Background Gradients */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[80px] transition-opacity duration-1000 -z-10 ${isStudyMode ? 'bg-blue-600/20 opacity-100' : 'bg-blue-600/5 opacity-0'}`} />
      </div>

      <p className="text-gray-500 text-sm font-medium">
        {isStudyMode ? 'Session in progress...' : 'Ready to start your session?'}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard icon={<Clock className="text-blue-400" />} value="12h 45m" label="TODAY" sub="3 sessions" />
        <StatCard icon={<Calendar className="text-emerald-400" />} value="42h 20m" label="THIS WEEK" sub="12 sessions" />
        <StatCard icon={<Trophy className="text-amber-400" />} value="Master" label="CURRENT TITLE" sub="Expert learner" />
        <StatCard icon={<Zap className="text-purple-400" />} value="156h" label="LIFETIME" sub="Keep it up!" />
      </div>

      {/* Support Section */}
      <div className="w-full bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-3xl p-8 flex flex-col items-center gap-4">
        <Heart className="text-red-500 fill-red-500" size={32} />
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Support Studiq AI</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Help us keep the servers running for students worldwide. Your contributions make AI learning accessible to all.
          </p>
        </div>
        <button className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
          Donate (Demo)
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, sub }: { icon: React.ReactNode, value: string, label: string, sub: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-left flex flex-col gap-1 transition-all hover:bg-gray-900/80 hover:border-gray-700"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-gray-800/50 rounded-lg">
        {icon}
      </div>
      <span className="text-xs font-bold text-gray-500 tracking-wider">{label}</span>
    </div>
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-xs text-gray-500">{sub}</span>
  </motion.div>
);

export default Dashboard;
