import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import QuizContainer from './components/QuizContainer';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <QuizContainer />
    </ChakraProvider>
  );
};

export default App; 