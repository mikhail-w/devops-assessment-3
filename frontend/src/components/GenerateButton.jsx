import { useOutletContext } from 'react-router-dom';
import { Button, useColorModeValue, Flex, Image, Box } from '@chakra-ui/react';
import { useState } from 'react';
import gp from '../assets/images/gp.png';

function GenerateButton({ getRandomPokemon, isMobileLandscape }) {
  const { setIsLoading } = useOutletContext();
  const [isPressed, setIsPressed] = useState(false);

  function handleClick() {
    setIsLoading(true);
    getRandomPokemon();
  }

  function handleTouchStart() {
    setIsPressed(true);
  }

  function handleTouchEnd() {
    setIsPressed(false);
  }

  return (
    <Flex
      position="fixed"
      bottom="30px"
      right={isMobileLandscape ? '30px' : '50%'}
      transform={isMobileLandscape ? 'none' : 'translateX(50%)'}
    >
      <Button
        fontFamily={'Pokemon Solid'}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        colorScheme="red"
        letterSpacing={5}
        lineHeight={3}
        size="lg"
        backgroundColor={'#14A44D'}
        padding={'1px 14px'}
        pt={3}
        pb={5}
        borderRadius={15}
        color={'#fff'}
        fontWeight={400}
        fontSize={30}
        boxShadow={'0 5px #999'}
        userSelect="none"
        touchAction="manipulation"
        WebkitTapHighlightColor="transparent"
        css={{
          '-webkit-touch-callout': 'none',
          '-webkit-user-select': 'none',
          '&:focus': {
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
          },
          '&:active': {
            outline: 'none',
          },
        }}
        sx={{
          '&:active': {
            backgroundColor: '#F35B0B !important',
            boxShadow: '0 2px #667 !important',
            transform: 'translateY(5px) !important',
          },
        }}
        style={{
          backgroundColor: isPressed ? '#F35B0B' : '#14A44D',
          transform: isPressed ? 'translateY(5px)' : 'none',
          boxShadow: isPressed ? '0 2px #667' : '0 5px #999',
        }}
        _hover={{
          backgroundColor: '#F35B0B',
          boxShadow: '0 6px #888',
        }}
        _focus={{
          outline: 'none',
          boxShadow: 'none',
        }}
      >
        {/* {text} */}
        <Box marginTop="16px" height="35px">
          <Image display="fixed" top="100px" height="100%" src={gp} />
        </Box>
      </Button>
    </Flex>
  );
}

export default GenerateButton;
