
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, FileText, Camera, Trash2, BookOpen, Loader2 } from 'lucide-react';
import { summarizeContent, chatWithTutor } from '../services/gemini';
import { ChatMessage } from '../types';

interface StudyAIProps {
  context: string;
  // Use React.Dispatch to allow functional updates (prev => prev + ...)
  setContext: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
}

const StudyAI: React.FC<StudyAIProps> = ({ context, setContext, isLoggedIn }) => {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSummarize = async () => {
    if (!context) return;
    setIsSummarizing(true);
    try {
      const res = await summarizeContent(context);
      setSummary(res);
    } catch (err) {
      setSummary("Error generating summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleChat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isChatting) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsChatting(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await chatWithTutor(history, input, context);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI tutor." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      // For this demo, we'll just prepend a note about the image.
      // In a real app, you'd send the image to Gemini as shown in the service.
      // Fix: setContext now correctly accepts a functional update thanks to the updated prop interface
      setContext(prev => prev + "\n[Attached Image Content...]");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <Sparkles className="text-blue-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Study Helper</h2>
          <p className="text-gray-400 text-sm">Paste notes, upload images, or chat with your tutor.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <section className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-300">
                <BookOpen size={18} />
                <span className="text-sm font-semibold">Source Material</span>
              </div>
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                      title="Upload Image"
                    >
                      <Camera size={18} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                  </>
                )}
                <button 
                  onClick={() => setContext('')}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Clear Notes"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <textarea
              className="w-full h-64 bg-gray-950 border border-gray-800 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-blue-500/50 transition-colors resize-none text-sm leading-relaxed"
              placeholder="Paste your lecture notes or textbook chapters here..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />

            <button
              onClick={handleSummarize}
              disabled={!context || isSummarizing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              {isSummarizing ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Sparkles size={20} />
                  Summarize Notes
                </>
              )}
            </button>
          </div>

          {summary && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-6 prose prose-invert max-w-none shadow-inner"
            >
              <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <FileText size={18} />
                AI Summary
              </h4>
              <div className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                {summary}
              </div>
            </motion.div>
          )}
        </section>

        {/* Chat Section */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-2xl flex flex-col h-[600px] shadow-xl overflow-hidden">
          <header className="p-4 border-b border-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-gray-200">AI Tutor Chat</h3>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Send size={48} className="mb-4 rotate-12" />
                <p>Ask me anything about your notes! I'm here to help you understand better.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-2xl rounded-tl-none border border-gray-700 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleChat} className="p-4 border-t border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask a question..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim() || isChatting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default StudyAI;
