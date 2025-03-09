import { Center, Image, Text } from '@chakra-ui/react';
import pikachu from '../assets/images/gifs/pikachu.gif';

function Loading({ isMobileLandscape }) {
  return (
    <Center
      height={isMobileLandscape ? '220px' : { base: '300px', md: '350px' }}
      paddingRight={isMobileLandscape ? '100px' : ''}
      flexDirection={'column'}
      mt={isMobileLandscape ? '' : { base: '100px', md: '' }}
    >
      <Image width={'300px'} src={pikachu} />
      <Text>Loading....</Text>
    </Center>
  );
}

export default Loading;
