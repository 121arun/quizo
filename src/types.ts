export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
  timeLimit: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  timeBonus: number;
  totalScore: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  timeBonus: number;
  isGameOver: boolean;
} 