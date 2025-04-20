import React, { useEffect, useState } from 'react';
import { Box, Heading, Center, Spinner, VStack, Text, Button, Flex } from '@chakra-ui/react';
import Question from './Question';
import { useQuiz } from '../hooks/useQuiz';
import { mockQuestions } from '../data/mockData';
import { Player, Question as QuestionType } from '../types/index';

// Results screen component
const QuizResults: React.FC<{
  player: Player;
  questions: QuestionType[];
  onComplete: (player: Player) => void;
}> = ({ player, questions, onComplete }) => {
  console.log("Rendering QuizResults with player:", player);
  
  return (
    <Box 
      minH="100vh" 
      bg="gray.800" 
      py={10} 
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack 
        spacing={8} 
        bg="whiteAlpha.200" 
        p={8} 
        borderRadius="xl" 
        maxW="800px" 
        w="100%"
        boxShadow="xl"
      >
        <Heading color="white" size="2xl" textAlign="center">
          Quiz Completed!
        </Heading>
        
        <VStack spacing={4} w="100%">
          <Box 
            bg="whiteAlpha.300" 
            p={6} 
            borderRadius="lg" 
            w="100%"
            textAlign="center"
          >
            <Text color="white" fontSize="xl" mb={2}>Your Score</Text>
            <Heading color="white" size="4xl">{player.score}</Heading>
          </Box>
          
          <Flex 
            w="100%" 
            justifyContent="space-between" 
            gap={4}
            direction={{ base: "column", md: "row" }}
          >
            <Box 
              bg="whiteAlpha.300" 
              p={4} 
              borderRadius="lg" 
              flex="1"
              textAlign="center"
            >
              <Text color="white" fontSize="md" mb={1}>Base Score</Text>
              <Heading color="white" size="lg">{player.score}</Heading>
            </Box>
            <Box 
              bg="whiteAlpha.300" 
              p={4} 
              borderRadius="lg" 
              flex="1"
              textAlign="center"
            >
              <Text color="white" fontSize="md" mb={1}>Time Bonus</Text>
              <Heading color="teal.300" size="lg">+{player.timeBonus}</Heading>
            </Box>
            <Box 
              bg="whiteAlpha.300" 
              p={4} 
              borderRadius="lg" 
              flex="1"
              textAlign="center"
            >
              <Text color="white" fontSize="md" mb={1}>Total Score</Text>
              <Heading color="yellow.300" size="lg">{player.totalScore}</Heading>
            </Box>
          </Flex>
        </VStack>
        
        <Text color="white" fontSize="lg" textAlign="center">
          You completed {questions.length} questions!
        </Text>
        
        <Button 
          colorScheme="teal" 
          size="lg" 
          onClick={() => onComplete(player)}
          px={10}
          py={6}
          fontSize="xl"
        >
          Back to Home
        </Button>
      </VStack>
    </Box>
  );
};

interface QuizProps {
  onComplete: (player: Player) => void;
  initialPlayer: Player;
}

const Quiz: React.FC<QuizProps> = ({ onComplete, initialPlayer }) => {
  console.log('Quiz component rendering');
  console.log('mockQuestions:', mockQuestions);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState<QuestionType | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [finalPlayer, setFinalPlayer] = useState<Player>(initialPlayer);
  
  const {
    quizState,
    currentQuestion,
    handleAnswer,
    startQuestion,
  } = useQuiz(mockQuestions);
  
  console.log('Quiz after useQuiz hook:', { quizState, currentQuestion });

  // Initialize component
  useEffect(() => {
    console.log('Quiz initialization effect');
    // Short timeout to ensure the component is fully mounted
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (currentQuestion) {
        console.log('Setting active question:', currentQuestion);
        setActiveQuestion(currentQuestion);
        startQuestion();
      }
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update active question when currentQuestion changes
  useEffect(() => {
    console.log('Quiz useEffect triggered, currentQuestion:', currentQuestion);
    if (currentQuestion && !isLoading) {
      console.log('Updating active question to:', currentQuestion);
      setActiveQuestion(currentQuestion);
      startQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id, isLoading]);
  
  // Check for quiz completion
  useEffect(() => {
    if (quizState.isCompleted) {
      console.log('Quiz completed, preparing result screen');
      const player: Player = {
        ...initialPlayer,
        score: quizState.score,
        timeBonus: quizState.timeBonus,
        totalScore: quizState.score + quizState.timeBonus,
      };
      setFinalPlayer(player);
      setShowResults(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState.isCompleted, quizState.score, quizState.timeBonus]);

  const handleQuestionAnswer = (answerIndex: number, timeLeft: number) => {
    console.log('handleQuestionAnswer called with:', { answerIndex, timeLeft });
    handleAnswer(answerIndex, timeLeft);
  };

  if (isLoading) {
    return (
      <Center height="100vh" bg="gray.800">
        <Spinner size="xl" color="white" thickness="4px" />
      </Center>
    );
  }
  
  if (showResults) {
    return (
      <QuizResults 
        player={finalPlayer}
        questions={mockQuestions}
        onComplete={onComplete}
      />
    );
  }

  if (!activeQuestion) {
    console.log('No active question available');
    return (
      <Box textAlign="center" py={10} bg="gray.800" minH="100vh">
        <Heading size="xl" mb={4} color="white">Loading Quiz...</Heading>
      </Box>
    );
  }

  console.log('Rendering Question component with:', activeQuestion);
  return (
    <Question
      question={activeQuestion}
      onAnswer={handleQuestionAnswer}
      questionNumber={quizState.currentQuestion + 1}
      totalQuestions={mockQuestions.length}
    />
  );
};

export default Quiz; 