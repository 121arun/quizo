import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Container,
  useColorModeValue,
  ScaleFade,
  SlideFade,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Image,
  Progress,
  ModalFooter,
  Divider,
  HStack,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Player } from '../types';
import { mockLeaderboard } from '../data/mockData';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Confetti component for celebrations
const Confetti = () => {
  const confettiPieces = Array.from({ length: 100 }).map((_, i) => {
    const size = Math.random() * 8 + 5;
    const colors = ['#FCD34D', '#34D399', '#60A5FA', '#F87171', '#A78BFA', '#FBBF24'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = `${Math.random() * 100}vw`;
    const animationDelay = `${Math.random() * 3}s`;
    const animationDuration = `${Math.random() * 3 + 3}s`;
    
    return (
      <Box
        key={i}
        position="fixed"
        width={`${size}px`}
        height={`${size}px`}
        bg={color}
        borderRadius={Math.random() > 0.5 ? 'full' : '2px'}
        top="-5vh"
        left={left}
        zIndex={5}
        transform="rotate(0deg)"
        animation={`
          ${fadeIn} ${animationDuration} ${animationDelay} linear infinite, 
          ${float} ${animationDuration} ${animationDelay} ease-in infinite,
          ${spin} ${animationDuration} linear infinite
        `}
        sx={{
          animationFillMode: 'both'
        }}
      />
    );
  });

  return <>{confettiPieces}</>;
};

interface LeaderboardProps {
  currentPlayer: Player;
  onPlayAgain: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentPlayer, onPlayAgain }) => {
  // State for controlling animations and celebrations
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDetailsFor, setShowDetailsFor] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Combine mock leaderboard with current player and sort by total score
  const allPlayers = [...mockLeaderboard, currentPlayer]
    .sort((a, b) => b.totalScore - a.totalScore);

  // Find the rank of the current player
  const playerRank = allPlayers.findIndex(player => player.id === currentPlayer.id) + 1;
  
  // Set background gradient
  const bgGradient = useColorModeValue(
    'linear(to-br, purple.600, blue.500)',
    'linear(to-br, purple.800, blue.700)'
  );

  // Show confetti on component mount if player is in top 3
  useEffect(() => {
    if (playerRank <= 3) {
      setShowConfetti(true);
      // Optionally hide confetti after some time
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [playerRank]);

  // Set celebration message based on rank
  const getCelebrationMessage = () => {
    if (playerRank === 1) return "AMAZING! YOU'RE #1";
    if (playerRank === 2) return "SO CLOSE TO THE TOP!";
    if (playerRank === 3) return "GREAT JOB ON THE PODIUM!";
    if (playerRank <= 5) return "NICELY DONE!";
    return "KEEP PRACTICING!";
  };

  // Get emoji for rank
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🏆";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    onOpen();
  };

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bg={bgGradient}
      p={4}
      position="relative"
      overflow="hidden"
    >
      {showConfetti && <Confetti />}
      
      <Container maxW="container.xl" py={8} zIndex={10}>
        <VStack spacing={10} animation={`${fadeIn} 0.6s ease-out`}>
          <ScaleFade initialScale={0.9} in={true}>
            <Heading
              size="2xl"
              color="white"
              textShadow="0px 4px 8px rgba(0,0,0,0.3)"
              textAlign="center"
              letterSpacing="wider"
              mb={2}
            >
              QUIZ COMPLETE!
            </Heading>
            
            <Text 
              fontSize="xl" 
              color="white" 
              textAlign="center"
              fontWeight="medium"
              textShadow="0px 2px 4px rgba(0,0,0,0.3)"
            >
              Let's see how you did compared to others!
            </Text>
          </ScaleFade>

          <Box 
            p={8} 
            borderRadius="xl" 
            bg="white" 
            width="100%" 
            textAlign="center"
            boxShadow="2xl"
            position="relative"
            overflow="hidden"
            animation={`${pulse} 2s infinite ease-in-out`}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
              animation: playerRank <= 3 ? `${shimmer} 2s infinite` : 'none',
              zIndex: 1,
            }}
          >
            <SlideFade in={true} offsetY="-20px">
              <Heading
                size="lg"
                color="gray.700"
                mb={4}
              >
                {getCelebrationMessage()}
              </Heading>
              
              <Box 
                borderRadius="full" 
                width="120px" 
                height="120px" 
                bg={playerRank <= 3 ? "yellow.100" : "blue.50"} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                mx="auto"
                mb={6}
                position="relative"
              >
                <CircularProgress 
                  value={Math.min(100, (currentPlayer.totalScore / 600) * 100)} 
                  size="120px" 
                  thickness="8px" 
                  color={playerRank <= 3 ? "yellow.500" : "blue.500"}
                >
                  <CircularProgressLabel fontSize="5xl">
                    {getRankEmoji(playerRank)}
                  </CircularProgressLabel>
                </CircularProgress>
              </Box>
              
              <Heading 
                fontSize="6xl" 
                fontWeight="extrabold" 
                color="blue.600"
                mb={6}
              >
                {currentPlayer.totalScore}
                <Text as="span" fontSize="3xl" ml={2} fontWeight="normal" color="gray.600">
                  points
                </Text>
              </Heading>
              
              <Flex justifyContent="center" gap={8}>
                <Box textAlign="center">
                  <Text fontSize="xl" color="gray.500">Base Score</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="purple.500">{currentPlayer.score}</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="xl" color="gray.500">Speed Bonus</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="green.500">+{currentPlayer.timeBonus}</Text>
                </Box>
              </Flex>
            </SlideFade>
          </Box>

          <Box 
            width="100%" 
            overflowX="auto"
            bg="whiteAlpha.900" 
            borderRadius="xl" 
            p={6}
            boxShadow="xl"
          >
            <Heading size="lg" mb={6} color="gray.700" textAlign="center">Leaderboard</Heading>
            <Table variant="simple" colorScheme="blue" size="lg">
              <Thead bg="blue.100">
                <Tr>
                  <Th width="10%" fontSize="md">Rank</Th>
                  <Th width="40%" fontSize="md">Player</Th>
                  <Th width="25%" isNumeric fontSize="md">Score</Th>
                  <Th width="25%" isNumeric fontSize="md">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allPlayers.map((player, index) => (
                  <Tr 
                    key={player.id}
                    bg={player.id === currentPlayer.id ? "blue.50" : index % 2 === 0 ? "white" : "gray.50"}
                    fontWeight={player.id === currentPlayer.id ? "bold" : "normal"}
                    transition="all 0.2s"
                    _hover={{ bg: "blue.100", cursor: "pointer" }}
                    onClick={() => handlePlayerClick(player)}
                  >
                    <Td>
                      <Flex align="center">
                        <Text fontSize="xl" fontWeight="bold" mr={2}>
                          {index + 1}
                        </Text>
                        {index < 3 && (
                          <Text fontSize="xl">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </Text>
                        )}
                      </Flex>
                    </Td>
                    <Td fontSize="lg">
                      {player.name}
                      {player.id === currentPlayer.id && (
                        <Badge ml={2} colorScheme="green" fontSize="sm">You</Badge>
                      )}
                    </Td>
                    <Td isNumeric fontSize="lg" fontWeight="bold">{player.totalScore}</Td>
                    <Td isNumeric>
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayerClick(player);
                        }}
                      >
                        Details
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Button
            colorScheme="green"
            size="lg"
            height="80px"
            width={{ base: "100%", md: "300px" }}
            fontSize="2xl"
            fontWeight="bold"
            onClick={onPlayAgain}
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'xl',
            }}
            borderRadius="xl"
            boxShadow="md"
            transition="all 0.3s"
            background="linear-gradient(135deg, #38B2AC 0%, #3182CE 100%)"
          >
            PLAY AGAIN
          </Button>
        </VStack>
      </Container>
      
      {/* Player details modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" overflow="hidden">
          <Box 
            bg={selectedPlayer?.id === currentPlayer.id ? "blue.500" : "purple.500"}
            p={6}
            color="white"
          >
            <Flex justify="space-between" align="center">
              <Heading size="lg">{selectedPlayer?.name}</Heading>
              {selectedPlayer?.id === currentPlayer.id && (
                <Badge colorScheme="green" p={2} borderRadius="md">You</Badge>
              )}
            </Flex>
          </Box>
          
          <ModalBody p={6}>
            {selectedPlayer && (
              <VStack spacing={6} align="stretch">
                <Flex justify="center" gap={4}>
                  <Box 
                    width="100px" 
                    height="100px" 
                    borderRadius="full" 
                    bg="gray.100" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    fontSize="4xl"
                  >
                    {getRankEmoji(allPlayers.findIndex(p => p.id === selectedPlayer.id) + 1)}
                  </Box>
                </Flex>
                
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Heading size="md" mb={4} textAlign="center" color="gray.700">Score Breakdown</Heading>
                  <VStack spacing={3} align="stretch">
                    <Flex justify="space-between">
                      <Text>Base Score:</Text>
                      <Text fontWeight="bold">{selectedPlayer.score}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Time Bonus:</Text>
                      <Text fontWeight="bold" color="green.500">+{selectedPlayer.timeBonus}</Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between">
                      <Text fontWeight="bold">Total Score:</Text>
                      <Text fontWeight="bold" fontSize="xl">{selectedPlayer.totalScore}</Text>
                    </Flex>
                  </VStack>
                </Box>
                
                <Box>
                  <Text fontWeight="medium" mb={2}>Performance</Text>
                  <HStack spacing={4}>
                    <Box flex="1">
                      <Text fontSize="sm" mb={1}>Speed</Text>
                      <Progress 
                        value={(selectedPlayer.timeBonus / 250) * 100} 
                        colorScheme="green" 
                        borderRadius="full" 
                        height="8px"
                      />
                    </Box>
                    <Box flex="1">
                      <Text fontSize="sm" mb={1}>Accuracy</Text>
                      <Progress 
                        value={(selectedPlayer.score / 450) * 100} 
                        colorScheme="blue" 
                        borderRadius="full"
                        height="8px" 
                      />
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter bg="gray.50">
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Leaderboard; 