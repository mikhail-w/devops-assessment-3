import { useOutletContext } from 'react-router-dom';
import { Button, useColorModeValue, Flex } from '@chakra-ui/react';

function GenerateButton({ getRandomPokemon, isMobileLandscape }) {
  const { setIsLoading } = useOutletContext();

  function handleClick() {
    setIsLoading(true);
    getRandomPokemon();
  }

  // Set button text dynamically
  const text = isMobileLandscape ? 'Generate' : 'Generate Random Pokemon';

  return (
    <Flex
      position="fixed"
      bottom="30px"
      right={isMobileLandscape ? '30px' : '50%'}
      transform={isMobileLandscape ? 'none' : 'translateX(50%)'}
    >
      <Button
        onClick={handleClick}
        colorScheme="red"
        size="lg"
        backgroundColor={useColorModeValue('#3d7dca', '#e53e3e')}
      >
        {text}
      </Button>
    </Flex>
  );
}

export default GenerateButton;
