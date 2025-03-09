import { useOutletContext } from 'react-router-dom';
import { Center, useColorModeValue } from '@chakra-ui/react';

function MainPokemonName({ isTeam, isMobileLandscape }) {
  const { pokemon } = useOutletContext();
  const backgroundColor = useColorModeValue('white', 'gray.800');

  return (
    <Center
      position="sticky"
      textDecoration="underline"
      textTransform="capitalize"
      textUnderlineOffset="8px"
      letterSpacing="5px"
      fontFamily="Pokemon Solid"
      fontSize={isMobileLandscape ? '1rem' : { base: '1rem', lg: '2rem' }}
      as="h3"
      backgroundColor={backgroundColor}
    >
      {isTeam === 'true' ? pokemon.name + "'s Team" : pokemon.name}
    </Center>
  );
}

export default MainPokemonName;
