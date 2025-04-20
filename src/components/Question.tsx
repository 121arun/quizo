import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  Heading, 
  Text, 
  VStack, 
  Progress, 
  Flex,
  Center,
  ScaleFade,
  SlideFade,
  useEventListener,
  Tooltip
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Question as QuestionType } from '../types/index';

// Define animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const timerFlash = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
`;

// Define option shapes based on a unique style rather than copying Kahoot
const optionShapes = [
  { shape: "option-a", icon: "A", color: "teal", key: "1", label: "A" },
  { shape: "option-b", icon: "B", color: "purple", key: "2", label: "B" },
  { shape: "option-c", icon: "C", color: "orange", key: "3", label: "C" },
  { shape: "option-d", icon: "D", color: "blue", key: "4", label: "D" }
];

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answerIndex: number, timeLeft: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

// Memoized Option Button component for performance
const OptionButton = memo(({ 
  index, 
  option, 
  isAnswered, 
  selectedOption, 
  correctAnswer, 
  handleAnswer 
}: { 
  index: number; 
  option: string; 
  isAnswered: boolean; 
  selectedOption: number | null; 
  correctAnswer: number;
  handleAnswer: (index: number) => void;
}) => {
  const optionInfo = optionShapes[index];
  
  return (
    <Box 
      position="relative"
      width="100%" 
      height="100%"
      data-testid={`option-${index}`}
    >
      <ScaleFade in={true} initialScale={0.9} delay={0.2 + index * 0.1}>
        <Button
          height="100%"
          width="100%"
          minH="180px"
          fontSize={{ base: "xl", md: "2xl" }}
          borderRadius="xl"
          colorScheme={optionInfo.color}
          onClick={() => handleAnswer(index)}
          isDisabled={isAnswered}
          _hover={!isAnswered ? { 
            transform: 'scale(1.02)', 
            boxShadow: 'xl' 
          } : {}}
          transition="all 0.3s"
          opacity={isAnswered && index !== selectedOption ? 0.7 : 1}
          position="relative"
          overflow="hidden"
          p={4}
          aria-label={`Option ${optionInfo.label}: ${option}`}
          variant="solid"
          boxShadow="md"
          _focus={{
            boxShadow: `0 0 0 3px ${optionInfo.color}.300`,
          }}
        >
          {/* Option label in corner */}
          <Flex 
            position="absolute" 
            top="8px" 
            left="8px" 
            alignItems="center"
            zIndex={2}
          >
            <Box
              bg={`${optionInfo.color}.600`}
              color="white"
              borderRadius="md"
              px={2}
              py={1}
              fontWeight="bold"
              fontSize="md"
              boxShadow="sm"
            >
              {optionInfo.label}
            </Box>
          </Flex>
          
          {/* Option number shortcut */}
          <Tooltip label={`Press ${optionInfo.key} key to select`} placement="top">
            <Flex 
              position="absolute" 
              top="8px" 
              right="8px" 
              alignItems="center"
              zIndex={2}
            >
              <Box
                bg="whiteAlpha.300"
                color="white"
                borderRadius="full"
                width="30px"
                height="30px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="md"
                boxShadow="inner"
              >
                {optionInfo.key}
              </Box>
            </Flex>
          </Tooltip>
          
          <Center w="100%" textAlign="center" px={8} py={4}>
            {option}
          </Center>
        </Button>
      </ScaleFade>
    </Box>
  );
});

OptionButton.displayName = 'OptionButton';

const Question: React.FC<QuestionProps> = ({ 
  question, 
  onAnswer, 
  questionNumber, 
  totalQuestions 
}) => {
  console.log('Question component rendering with:', question);
  
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const questionStartTimeRef = useRef(Date.now());
  const isMountedRef = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    isMountedRef.current = true;
    console.log("Question component mounted");
    
    // Initialize question timer when component mounts
    questionStartTimeRef.current = Date.now();
    
    return () => {
      console.log("Question component unmounting");
      isMountedRef.current = false;
    };
  }, []);

  // Handle answer selection
  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedOption(optionIndex);

    const actualTimeLeft = Math.max(0, question.timeLimit - ((Date.now() - questionStartTimeRef.current) / 1000));
    
    // Add a delay before proceeding to the next question
    setTimeout(() => {
      if (isMountedRef.current) {
        onAnswer(optionIndex, actualTimeLeft);
      }
    }, 400); // 0.4 seconds delay - adjust as needed
  }, [isAnswered, onAnswer, question.timeLimit]);

  // Main question timer
  useEffect(() => {
    console.log("Starting main timer for question:", question.id);
    
    setTimeLeft(question.timeLimit);
    setSelectedOption(null);
    setIsAnswered(false);
    questionStartTimeRef.current = Date.now();

    let lastUpdateTime = Date.now();
    let remainingTime = question.timeLimit;
    
    const updateTimer = () => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      const deltaTime = (now - lastUpdateTime) / 1000;
      lastUpdateTime = now;
      
      remainingTime -= deltaTime;
      
      if (remainingTime <= 0 && !isAnswered) {
        setTimeLeft(0);
        handleAnswer(-1);
        return;
      }
      
      setTimeLeft(Math.max(0, Math.floor(remainingTime)));
      if (!isAnswered && remainingTime > 0) {
        requestAnimationFrame(updateTimer);
      }
    };
    
    const animationId = requestAnimationFrame(updateTimer);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, question.timeLimit]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isAnswered) return;
    const key = e.key;
    if (['1', '2', '3', '4'].includes(key)) {
      const index = parseInt(key) - 1;
      if (index >= 0 && index < question.options.length) {
        handleAnswer(index);
      }
    }
  }, [handleAnswer, isAnswered, question.options.length]);

  // Fix: Properly specify document as the target for useEventListener
  useEventListener(document, 'keydown', handleKeyDown);

  // Get timer color based on time left
  const getTimerColor = useCallback(() => {
    if (timeLeft < 5) return "red.500";
    if (timeLeft < 10) return "yellow.500";
    return "green.500";
  }, [timeLeft]);

  return (
    <Box 
      minH="100vh" 
      bg="gray.800" 
      pt={8} 
      pb={16}
      position="relative"
      overflow="hidden"
    >
      <VStack spacing={6} align="stretch" maxW="1200px" mx="auto" width="100%" position="relative">
        {/* Top section */}
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Question {questionNumber}/{totalQuestions}
            </Text>
            <Progress 
              value={(questionNumber / totalQuestions) * 100} 
              colorScheme="blue" 
              size="sm" 
              borderRadius="full"
              width="200px"
              aria-label="Question progress"
            />
          </Box>
          <ScaleFade in={true} initialScale={0.8}>
            <Box 
              p={4} 
              borderRadius="full" 
              bg={getTimerColor()} 
              color="white"
              width="80px" 
              height="80px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="3xl"
              fontWeight="bold"
              animation={timeLeft < 5 ? `${timerFlash} 0.5s infinite` : undefined}
              boxShadow="lg"
              aria-label={`${timeLeft} seconds remaining`}
              role="timer"
            >
              {timeLeft}
            </Box>
          </ScaleFade>
        </Flex>

        {/* Question Text */}
        <VStack 
          spacing={4} 
          maxW="900px" 
          mx="auto" 
          p={8}
        >
          <SlideFade in={true} offsetY="20px">
            <Heading 
              textAlign="center" 
              size="xl" 
              mb={2}
              color="white"
            >
              {question.question}
            </Heading>
          </SlideFade>
        </VStack>

        {/* Answer options - Grid with exactly 2x2 layout */}
        <Box ref={optionsRef}>
          <Grid 
            templateColumns="repeat(2, 1fr)" 
            templateRows="repeat(2, 1fr)"
            gap={6} 
            mt={4}
            height={{ base: "auto", md: "380px" }}
          >
            {question.options.map((option, index) => (
              <OptionButton
                key={index}
                index={index}
                option={option}
                isAnswered={isAnswered}
                selectedOption={selectedOption}
                correctAnswer={question.correctAnswer}
                handleAnswer={handleAnswer}
              />
            ))}
          </Grid>
        </Box>

        {/* Keyboard shortcut hint */}
        <Text 
          textAlign="center" 
          color="whiteAlpha.800" 
          fontSize="sm" 
          mt={4}
          fontStyle="italic"
        >
          Press 1-4 keys to select options
        </Text>

        {/* Score indicator */}
        {isAnswered && (
          <Box 
            position="absolute" 
            top="50%" 
            left="50%" 
            transform="translate(-50%, -50%)" 
            zIndex={10}
            textAlign="center"
          >
            <SlideFade in={isAnswered} offsetY="-30px">
              <Box 
                bg="whiteAlpha.900" 
                p={6} 
                borderRadius="xl" 
                boxShadow="2xl"
                animation={`${pulse} 1s infinite`}
              >
                <Heading size="xl" mb={2} color={selectedOption === question.correctAnswer ? "blue.500" : "blue.500"}>
                  {selectedOption === question.correctAnswer ? "Loading..." : "Loading..."}
                </Heading>
              </Box>
            </SlideFade>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

// Export memoized component for performance
export default memo(Question);