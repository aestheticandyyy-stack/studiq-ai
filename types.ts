
export type Tab = 'dashboard' | 'ai' | 'quiz' | 'flashcards';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  durationSeconds: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
