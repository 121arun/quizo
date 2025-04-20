import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  Input,
  FormControl,
  FormLabel,
  Flex,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Avatar,
  Badge,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { mockLeaderboard } from '../data/mockData';
import { Player } from '../types/index';

// Define animations
const pulse = keyframes`
  0% {transform: scale(1); box-shadow: 0 0 0 0 rgba(99,179,237,0.4);}
  70% {transform: scale(1.05); box-shadow: 0 0 0 15px rgba(99,179,237,0);}
  100% {transform: scale(1); box-shadow: 0 0 0 0 rgba(99,179,237,0);}
`;

// Default current player for leaderboard
const defaultPlayer: Player = {
  id: 'player1',
  name: 'You',
  score: 0,
  timeBonus: 0,
  totalScore: 0
};

interface WelcomeProps {
  onStartQuiz: (player: Player) => void;
  currentPlayer?: Player;
}

const Welcome: React.FC<WelcomeProps> = ({ onStartQuiz, currentPlayer = defaultPlayer }) => {
  const [playerName, setPlayerName] = useState(currentPlayer.name);
  console.log("Welcome component rendering");

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.500, teal.400)',
    'linear(to-br, blue.600, teal.500)'
  );

  const handleStartQuiz = () => {
    console.log("Start Quiz button clicked");
    const player: Player = {
      ...currentPlayer,
      name: playerName || currentPlayer.name,
      score: 0,
      timeBonus: 0,
      totalScore: 0
    };
    console.log("Sending player to onStartQuiz:", player);
    
    // Call with a slight delay to ensure state updates properly
    setTimeout(() => {
      onStartQuiz(player);
    }, 0);
  };

  // Get rank badge for top 3 players
  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <HStack spacing={1}>
          <Text fontSize="xl" role="img" aria-label="trophy">🏆</Text>
          <Text fontWeight="bold">1st</Text>
        </HStack>
      );
    } else if (index === 1) {
      return (
        <HStack spacing={1}>
          <Text fontSize="xl" role="img" aria-label="silver medal">🥈</Text>
          <Text fontWeight="bold">2nd</Text>
        </HStack>
      );
    } else if (index === 2) {
      return (
        <HStack spacing={1}>
          <Text fontSize="xl" role="img" aria-label="bronze medal">🥉</Text>
          <Text fontWeight="bold">3rd</Text>
        </HStack>
      );
    }
    return <Text fontWeight="bold">#{index + 1}</Text>;
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap={10} 
        minH="80vh"
        align="stretch"
      >
        {/* Left Side - Quiz Form */}
        <VStack 
          alignItems="stretch" 
          w={{ base: "100%", md: "50%" }}
          spacing={8}
          p={8}
          borderRadius="xl"
          bg={bgGradient}
          color="white"
          boxShadow="xl"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: 'full',
            bg: 'whiteAlpha.100',
            zIndex: 0,
          }}
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '-5%',
            left: '-5%',
            width: '200px',
            height: '200px',
            borderRadius: 'full',
            bg: 'whiteAlpha.100',
            zIndex: 0,
          }}
        >
          <Heading 
            size="xl" 
            textAlign="center" 
            fontWeight="extrabold"
            textShadow="0px 2px 5px rgba(0,0,0,0.2)"
            letterSpacing="wide"
            mb={4}
          >
            Quiz Master
          </Heading>
          
          <Text 
            textAlign="center" 
            fontSize="lg" 
            fontWeight="medium"
            opacity={0.9}
            mb={6}
          >
            Test your knowledge and compete for the top spot!
          </Text>
          
          <Box 
            bg="whiteAlpha.200" 
            p={6} 
            borderRadius="lg" 
            backdropFilter="blur(5px)"
            boxShadow="inner"
            zIndex={1}
          >
            <FormControl>
              <FormLabel fontWeight="bold" fontSize="lg">Your Name</FormLabel>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                size="lg"
                mb={8}
                bg="whiteAlpha.300"
                border="none"
                color="white"
                _placeholder={{
                  color: 'whiteAlpha.700'
                }}
                _hover={{
                  bg: 'whiteAlpha.400'
                }}
                _focus={{
                  bg: 'whiteAlpha.500',
                  boxShadow: '0 0 0 1px white'
                }}
              />
            </FormControl>
          </Box>
          
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleStartQuiz}
            alignSelf="center"
            w="180px"
            h="60px"
            fontSize="xl"
            fontWeight="bold"
            bg="white"
            color="blue.500"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'xl',
              bg: 'white',
            }}
            _active={{
              transform: 'scale(0.98)',
            }}
            animation={`${pulse} 2s infinite`}
            boxShadow="0px 4px 10px rgba(0,0,0,0.2)"
            mt={4}
            zIndex={1}
          >
            Start Quiz
          </Button>
          
          <Box 
            mt={6} 
            p={4} 
            bg="whiteAlpha.200" 
            borderRadius="md" 
            zIndex={1}
          >
            <Heading size="sm" mb={3} textAlign="center">How to Play</Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>• Answer questions correctly for points</Text>
              <Text>• Answer quickly for time bonus points</Text>
              <Text>• Try to reach the top of the leaderboard</Text>
            </VStack>
          </Box>
        </VStack>
        
        {/* Right Side - Leaderboard */}
        <Box 
          w={{ base: "100%", md: "50%" }}
          bg="pink.100"
          p={6}
          borderRadius="md"
        >
          <Heading size="xl" mb={6} textAlign="center">Leaderboard</Heading>
          
          <Table variant="simple" size="md">
            <Thead bg="white">
              <Tr>
                <Th width="10%">Rank</Th>
                <Th width="60%">Player</Th>
                <Th width="30%" isNumeric>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockLeaderboard.slice(0, 10).map((player, index) => (
                <Tr 
                  key={player.id}
                  bg={index % 2 === 0 ? "white" : "pink.50"}
                  _hover={{ bg: "pink.200" }}
                  transition="all 0.2s"
                >
                  <Td>
                    {getRankBadge(index)}
                  </Td>
                  <Td>
                    <Flex align="center" gap={2}>
                      <Avatar size="sm" name={player.name} src={player.avatar} />
                      <Text>{player.name}</Text>
                    </Flex>
                  </Td>
                  <Td isNumeric fontWeight="bold">{player.totalScore}</Td>
                </Tr>
              ))}
              {currentPlayer?.totalScore > 0 && (
                <Tr bg="blue.50">
                  <Td>
                    <Badge colorScheme="blue">YOU</Badge>
                  </Td>
                  <Td>
                    <Flex align="center" gap={2}>
                      <Avatar size="sm" name={currentPlayer.name} />
                      <Text fontWeight="bold">{currentPlayer.name}</Text>
                    </Flex>
                  </Td>
                  <Td isNumeric fontWeight="bold">{currentPlayer.totalScore}</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Container>
  );
};

export default Welcome; 