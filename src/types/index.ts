export interface Player {
  id: string;
  name: string;
  score: number;
  timeBonus: number;
  totalScore: number;
  avatar?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points?: number;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  timeBonus: number;
  answers: number[];
  timeRemaining: number;
  isCompleted: boolean;
} 