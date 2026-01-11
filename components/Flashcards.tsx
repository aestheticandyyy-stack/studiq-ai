
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Loader2, ArrowLeft, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { generateFlashcards } from '../services/gemini';
import { Flashcard } from '../types';

interface FlashcardsProps {
  context: string;
}

const Flashcards: React.FC<FlashcardsProps> = ({ context }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!context) return;
    setIsLoading(true);
    try {
      const res = await generateFlashcards(context);
      setCards(res);
      setCurrentIdx(0);
      setIsFlipped(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!context) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20">
          <AlertCircle className="text-amber-500 w-12 h-12 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-white mb-2">No Context Provided</h3>
          <p className="text-gray-400 max-w-sm">Please go to the Study AI tab and add context to generate flashcards.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        <p className="text-gray-400 font-medium">Generating smart flashcards...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-8">
        <div className="bg-blue-600/10 p-8 rounded-full border border-blue-500/20">
          <GraduationCap size={64} className="text-blue-500" />
        </div>
        <div className="space-y-4 max-w-lg">
          <h2 className="text-3xl font-black text-white">Smart Flashcards</h2>
          <p className="text-gray-400">Generate a deck of AI-powered flashcards from your study material to master key terms and concepts.</p>
        </div>
        <button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all"
        >
          Generate Deck
        </button>
      </div>
    );
  }

  const card = cards[currentIdx];

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <header className="flex justify-between items-center px-4">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white">Deck 01</span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mastery in progress</span>
        </div>
        <button 
          onClick={handleGenerate}
          className="p-3 text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      {/* Flashcard container */}
      <div 
        className="relative perspective-[1500px] h-96 md:h-[420px] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-full h-full relative preserve-3d"
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-gray-900 border-2 border-gray-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl">
            <span className="text-sm font-bold text-blue-500 mb-6 tracking-widest uppercase">Question</span>
            <p className="text-xl md:text-3xl font-bold text-white leading-tight">{card.front}</p>
            <span className="absolute bottom-10 text-gray-500 text-xs font-medium italic">Tap to flip</span>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-blue-600 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl rotate-y-180">
            <span className="text-sm font-bold text-white/50 mb-6 tracking-widest uppercase">Answer</span>
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">{card.back}</p>
            <span className="absolute bottom-10 text-white/50 text-xs font-medium italic">Tap to flip back</span>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between px-4">
        <button
          disabled={currentIdx === 0}
          onClick={() => { setCurrentIdx(c => c - 1); setIsFlipped(false); }}
          className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-bold"
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        <span className="text-gray-500 font-bold tabular-nums">
          {currentIdx + 1} / {cards.length}
        </span>
        <button
          disabled={currentIdx === cards.length - 1}
          onClick={() => { setCurrentIdx(c => c + 1); setIsFlipped(false); }}
          className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-bold"
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
