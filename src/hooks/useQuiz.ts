import { useState, useCallback, useRef, useEffect } from 'react';
import { Question, QuizState } from '../types/index';

export const useQuiz = (questions: Question[]) => {
  console.log('useQuiz hook called with questions:', questions);
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    timeBonus: 0,
    answers: [],
    timeRemaining: 0,
    isCompleted: false,
  });

  useEffect(() => {
    console.log('Current quiz state:', quizState);
    console.log('Current question index:', quizState.currentQuestion);
    console.log('Available questions:', questions);
    console.log('Current question object:', questions[quizState.currentQuestion]);
    
    // Check if all questions have been answered
    if (quizState.answers.length >= questions.length && !quizState.isCompleted) {
      console.log('All questions answered, setting isCompleted to true');
      setQuizState(prev => ({
        ...prev,
        isCompleted: true
      }));
    }
  }, [quizState, questions]);

  const questionStartTimeRef = useRef<number>(0);

  const startQuestion = useCallback(() => {
    console.log('startQuestion called');
    questionStartTimeRef.current = Date.now();
    setQuizState(prev => ({
      ...prev,
      timeRemaining: questions[prev.currentQuestion].timeLimit,
    }));
  }, [questions]);

  const handleAnswer = useCallback((answerIndex: number, timeLeft: number) => {
    console.log('handleAnswer called with:', { answerIndex, timeLeft });
    if (quizState.currentQuestion >= questions.length) return;
    
    const currentQuestion = questions[quizState.currentQuestion];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    // Calculate time bonus (max 100 points, decreases with time)
    const timeBonus = Math.max(0, Math.floor((timeLeft / currentQuestion.timeLimit) * 100));
    
    // Base score for correct answer
    const baseScore = isCorrect ? 100 : 0;
    
    setQuizState(prev => {
      const newAnswers = [...prev.answers, answerIndex];
      const newScore = prev.score + baseScore;
      const newTimeBonus = prev.timeBonus + timeBonus;
      
      const isLastQuestion = prev.currentQuestion === questions.length - 1;
      
      return {
        ...prev,
        answers: newAnswers,
        score: newScore,
        timeBonus: newTimeBonus,
        currentQuestion: isLastQuestion ? prev.currentQuestion : prev.currentQuestion + 1,
        isCompleted: isLastQuestion,
      };
    });
    
    // Extra check for last question to ensure isCompleted is set
    if (quizState.currentQuestion === questions.length - 1) {
      console.log('Last question answered, setting isCompleted flag');
      setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          isCompleted: true,
        }));
      }, 50);
    }
  }, [questions, quizState.currentQuestion]);

  const resetQuiz = useCallback(() => {
    console.log('resetQuiz called');
    setQuizState({
      currentQuestion: 0,
      score: 0,
      timeBonus: 0,
      answers: [],
      timeRemaining: 0,
      isCompleted: false,
    });
  }, []);

  return {
    quizState,
    currentQuestion: quizState.currentQuestion < questions.length ? questions[quizState.currentQuestion] : null,
    startQuestion,
    handleAnswer,
    resetQuiz,
  };
}; 