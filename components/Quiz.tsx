
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Loader2, CheckCircle2, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { generateQuiz } from '../services/gemini';
import { QuizQuestion } from '../types';

interface QuizProps {
  context: string;
}

const Quiz: React.FC<QuizProps> = ({ context }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleStartQuiz = async () => {
    if (!context) return;
    setIsLoading(true);
    setQuestions([]);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    try {
      const res = await generateQuiz(context);
      setQuestions(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    if (opt === questions[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (!context) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20">
          <AlertCircle className="text-amber-500 w-12 h-12 mb-4 mx-auto" />
          <h3 className="text-xl font-bold text-white mb-2">No Context Provided</h3>
          <p className="text-gray-400 max-w-sm">Please go to the Study AI tab and add some lecture notes before generating a quiz.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        <p className="text-gray-400 font-medium">Gemini is crafting custom questions for you...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/50 border border-gray-800 rounded-3xl p-12 text-center shadow-2xl space-y-8"
      >
        <div className="inline-block p-4 bg-emerald-500/10 rounded-2xl">
          <CheckCircle2 className="text-emerald-500 w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white">Quiz Completed!</h2>
          <p className="text-gray-400 text-xl font-medium">You scored <span className="text-blue-400">{score}</span> out of <span className="text-white">{questions.length}</span></p>
        </div>
        <div className="w-full bg-gray-950 rounded-2xl h-4 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(score / questions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
          />
        </div>
        <button
          onClick={handleStartQuiz}
          className="flex items-center gap-2 mx-auto bg-white text-black font-bold px-8 py-4 rounded-2xl hover:bg-gray-200 transition-all"
        >
          <RefreshCw size={20} />
          Try Again
        </button>
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-8">
        <div className="bg-blue-600/10 p-8 rounded-full border border-blue-500/20">
          <LayoutGrid size={64} className="text-blue-500" />
        </div>
        <div className="space-y-4 max-w-lg">
          <h2 className="text-3xl font-black text-white">Knowledge Check</h2>
          <p className="text-gray-400">Generate a personalized 5-question quiz based on your study material to test your understanding.</p>
        </div>
        <button
          onClick={handleStartQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all"
        >
          Generate Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center px-2">
        <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">Question {currentIdx + 1} of {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`w-8 h-1.5 rounded-full ${i <= currentIdx ? 'bg-blue-500' : 'bg-gray-800'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl"
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-tight">
            {q.question}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, i) => {
              const isCorrect = opt === q.correctAnswer;
              const isSelected = selectedOption === opt;
              let style = "bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700";
              
              if (isAnswered) {
                if (isCorrect) style = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                else if (isSelected) style = "bg-red-500/20 border-red-500 text-red-400";
                else style = "bg-gray-950/50 border-gray-800 text-gray-600 opacity-50";
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`group relative flex items-center justify-between px-6 py-5 rounded-2xl border-2 transition-all text-left font-medium ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 p-6 bg-blue-600/5 rounded-2xl border border-blue-500/20"
            >
              <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Explanation
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
              <button
                onClick={nextQuestion}
                className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all"
              >
                {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
