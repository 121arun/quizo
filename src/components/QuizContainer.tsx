import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Welcome from './Welcome';
import Quiz from './Quiz';
import { Player } from '../types/index';

// Generate a fake player name for current user
const generatePlayerName = () => {
  const adjectives = ['Clever', 'Brilliant', 'Quick', 'Smart', 'Amazing', 'Super', 'Awesome'];
  const nouns = ['Player', 'Quizzer', 'Champion', 'Master', 'Genius', 'Mind', 'Star'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj}${noun}`;
};

const QuizContainer: React.FC = () => {
  console.log('QuizContainer rendering');
  
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    id: 'player1',
    name: generatePlayerName(),
    score: 0,
    timeBonus: 0,
    totalScore: 0
  });
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  useEffect(() => {
    console.log('Quiz started state:', isQuizStarted);
  }, [isQuizStarted]);

  const handleStartQuiz = (player: Player) => {
    console.log('Starting quiz with player:', player);
    setCurrentPlayer(player);
    setIsQuizStarted(true);
  };

  const handleQuizComplete = (player: Player) => {
    console.log('Quiz completed with player:', player);
    setCurrentPlayer(player);
    setIsQuizStarted(false);
  };

  return (
    <Box minH="100vh" bg="gray.800">
      {!isQuizStarted ? (
        <Welcome 
          onStartQuiz={handleStartQuiz}
          currentPlayer={currentPlayer}
        />
      ) : (
        <Quiz 
          onComplete={handleQuizComplete}
          initialPlayer={currentPlayer}
        />
      )}
    </Box>
  );
};

export default QuizContainer; 