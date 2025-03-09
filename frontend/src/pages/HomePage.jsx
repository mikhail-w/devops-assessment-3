import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import HomePageImages from '@/components/HomePageImages';
import '../assets/styles/HomePage.css';
import { keyframes } from '@emotion/react';

function HomePage() {
  const { setRandomChoice, setIsLoading, passed, setPassed } =
    useOutletContext();
  const navigate = useNavigate();
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  // Pokeball bounce animation
  const bounce = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  `;

  const buttonAnimation = `${bounce} 2s ease-in-out infinite`;

  useEffect(() => {
    const checkMobileLandscape = () => {
      const isLandscape =
        window.innerWidth > window.innerHeight && window.innerWidth <= 918;
      setIsMobileLandscape(isLandscape);
    };

    checkMobileLandscape();
    window.addEventListener('resize', checkMobileLandscape);
    return () => window.removeEventListener('resize', checkMobileLandscape);
  }, []);

  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  const buttons = [
    {
      label: 'Get Pokemon',
      handler: () => navigate('/random/'),
      styles: {
        bg: 'red.500',
        _hover: {
          bg: 'red.600',
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 0 #A93226, 0 8px 10px rgba(0,0,0,0.2)',
        },
        _active: {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 0 #A93226',
        },
        boxShadow: '0 4px 0 #A93226',
        width: '200px',
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        position: 'relative',
        borderRadius: '25px',
        animation: buttonAnimation,
      },
    },
    {
      label: 'View Pokemon List',
      handler: () => navigate('/list/'),
      styles: {
        bg: 'blue.500',
        _hover: {
          bg: 'blue.600',
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 0 #2E86C1, 0 8px 10px rgba(0,0,0,0.2)',
        },
        _active: {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 0 #2E86C1',
        },
        boxShadow: '0 4px 0 #2E86C1',
        width: '250px',
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        position: 'relative',
        borderRadius: '25px',
        animation: buttonAnimation,
      },
    },
    {
      label: 'PokeFlip Game',
      handler: () => navigate('/flip/'),
      styles: {
        bg: 'yellow.400',
        _hover: {
          bg: 'yellow.500',
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 0 #F1C40F, 0 8px 10px rgba(0,0,0,0.2)',
        },
        _active: {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 0 #F1C40F',
        },
        boxShadow: '0 4px 0 #F1C40F',
        width: '250px',
        color: 'gray.800',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        position: 'relative',
        borderRadius: '25px',
        animation: buttonAnimation,
      },
    },
  ];

  return (
    <Flex
      direction="column"
      justify="space-between"
      align="center"
      height="90vh"
      px={4}
      position="relative"
    >
      <Box flex="1" width="100%">
        <HomePageImages isMobileLandscape={isMobileLandscape} />
      </Box>

      {isMobileLandscape && (
        <Text mb={4} color="blue.500">
          Mobile Landscape Mode Detected!
        </Text>
      )}

      <Flex
        direction={isMobileLandscape ? 'row' : 'column'}
        mb={isMobileLandscape ? '20' : '10'}
        align="center"
        gap={6}
        w="100%"
        maxW="md"
        justify="center"
      >
        {buttons.map(({ label, handler, styles }) => (
          <Button
            key={label}
            onClick={handler}
            size={buttonSize}
            {...styles}
            transition="all 0.2s"
            _before={{
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '10px',
              width: '8px',
              height: '8px',
              bg: 'white',
              borderRadius: 'full',
              transform: 'translateY(-50%)',
              opacity: 0.7,
            }}
          >
            {label}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}

export default HomePage;
