import React, { createContext, useContext, useState } from 'react';
import { Question, QuizState, Player } from '../types/index';
import { mockQuestions } from '../data/mockData';

// Define the context shape
interface QuizContextType {
  quizState: QuizState;
  currentPlayer: Player;
  questions: Question[];
  startQuiz: () => void;
  answerQuestion: (answerIndex: number, timeLeft: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

// Create context with a default value
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Initial state
const initialQuizState: QuizState = {
  currentQuestion: 0,
  score: 0,
  timeBonus: 0,
  answers: [],
  timeRemaining: 0,
  isCompleted: false
};

const initialPlayer: Player = {
  id: 'player1',
  name: 'Player',
  score: 0,
  timeBonus: 0,
  totalScore: 0,
};

// Provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(initialPlayer);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

  const startQuiz = () => {
    setQuizState(initialQuizState);
    setCurrentPlayer(initialPlayer);
  };

  const answerQuestion = (answerIndex: number, timeLeft: number) => {
    const currentQuestion = questions[quizState.currentQuestion];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.round(timeLeft * 5);
      const newScore = quizState.score + (currentQuestion.points || 100);
      const newTimeBonus = quizState.timeBonus + timeBonus;
      
      setQuizState(prev => ({
        ...prev,
        score: newScore,
        timeBonus: newTimeBonus,
        answers: [...prev.answers, answerIndex],
      }));
      
      setCurrentPlayer(prev => ({
        ...prev,
        score: newScore,
        timeBonus: newTimeBonus,
        totalScore: newScore + newTimeBonus,
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        answers: [...prev.answers, answerIndex],
      }));
    }
  };

  const nextQuestion = () => {
    const isLastQuestion = quizState.currentQuestion === questions.length - 1;
    
    if (isLastQuestion) {
      setQuizState(prev => ({
        ...prev,
        isCompleted: true,
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    }
  };

  const resetQuiz = () => {
    setQuizState(initialQuizState);
    setCurrentPlayer(initialPlayer);
  };

  return (
    <QuizContext.Provider 
      value={{ 
        quizState, 
        currentPlayer,
        questions,
        startQuiz, 
        answerQuestion, 
        nextQuestion, 
        resetQuiz 
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to use the quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}; 