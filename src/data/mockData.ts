import { Question, Player } from '../types/index';

export const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2, // Paris
    timeLimit: 15,
    points: 100
  },
  {
    id: '2',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1, // Mars
    timeLimit: 15,
    points: 100
  },
  {
    id: '3',
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 2, // Leonardo da Vinci
    timeLimit: 20,
    points: 100
  },
  {
    id: '4',
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 1, // Blue Whale
    timeLimit: 15,
    points: 100
  },
  {
    id: '5',
    question: 'Which element has the chemical symbol Au?',
    options: ['Silver', 'Copper', 'Gold', 'Aluminum'],
    correctAnswer: 2, // Gold
    timeLimit: 20,
    points: 100
  },
];

export const mockLeaderboard: Player[] = [
  {
    id: 'player2',
    name: 'Quiz Wizard',
    score: 950,
    timeBonus: 250,
    totalScore: 1200,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=wizard',
  },
  {
    id: 'player3',
    name: 'Brain Storm',
    score: 900,
    timeBonus: 200,
    totalScore: 1100,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=brain',
  },
  {
    id: 'player4',
    name: 'Trivia Master',
    score: 850,
    timeBonus: 150,
    totalScore: 1000,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=trivia',
  },
  {
    id: 'player5',
    name: 'Knowledge Hunter',
    score: 780,
    timeBonus: 180,
    totalScore: 960,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=hunter',
  },
  {
    id: 'player6',
    name: 'Quick Thinker',
    score: 750,
    timeBonus: 190,
    totalScore: 940,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=quick',
  },
  {
    id: 'player7',
    name: 'Fact Finder',
    score: 700,
    timeBonus: 120,
    totalScore: 820,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=finder',
  },
  {
    id: 'player8',
    name: 'Puzzle Solver',
    score: 650,
    timeBonus: 100,
    totalScore: 750,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=solver',
  },
  {
    id: 'player9',
    name: 'Quiz Rookie',
    score: 500,
    timeBonus: 50,
    totalScore: 550,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=rookie',
  },
]; 