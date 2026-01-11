
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, User as UserIcon, ArrowRight, Loader2, Chrome } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation of network request
    setTimeout(() => {
      onLogin({
        id: '1',
        name: formData.name || (formData.email.split('@')[0]),
        email: formData.email,
        avatar: `https://picsum.photos/seed/${formData.email}/100/100`
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'google-user',
        name: 'Google Scholar',
        email: 'scholar@gmail.com',
        avatar: 'https://picsum.photos/seed/google/100/100'
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/50 border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-600/30">
            <Brain className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-400">Join 10k+ students studying smarter with AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required
                type="text" 
                placeholder="Full Name"
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              required
              type="email" 
              placeholder="Email Address"
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              required
              type="password" 
              placeholder="Password"
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-gray-500 font-bold">Or continue with</span></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-gray-950 hover:bg-gray-900 border border-gray-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
        >
          <Chrome size={20} />
          Google Account
        </button>

        <p className="text-center mt-8 text-gray-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 font-bold hover:underline"
          >
            {isLogin ? 'Sign up for free' : 'Sign in here'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
