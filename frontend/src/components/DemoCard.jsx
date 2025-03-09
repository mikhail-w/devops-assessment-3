import React from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { colors } from '../utils';
import bgImg from '../assets/images/pokeballs/ballopacity.png';
import { getBackgroundColors } from '../utils';
import TypeBadge from './PokemonCard/TypeBadge';

// Helper function to get background colors based on Pokemon type

// Main Pokemon Card Component
const DemoCard = ({ id, name, type, isCaught, imageUrl }) => {
  // Convert single type to array if needed
  const types = Array.isArray(type) ? type : [type];
  const backgroundColor = getBackgroundColors(type);

  // Get background color based on first type
  // const bgColor = getBackgroundColor(types[0]);

  return (
    <Box
      position="relative"
      borderRadius="xl"
      p={4}
      bgGradient={`linear-gradient(${backgroundColor[0]}, ${backgroundColor[1]})`}
      transition="all 0.3s"
      _hover={{ shadow: 'lg' }}
      overflow="hidden"
      width="full"
      maxW="md"
    >
      <Image
        src={bgImg}
        alt="pokeball background"
        w="250px"
        position="absolute"
        right="-30px"
        top="-40px"
        opacity={0.9}
        objectFit="contain"
        transform="rotate(15deg)"
      />
      <Flex justify="space-between" alignItems="flex-start">
        {/* Left side: ID, Name, Catch Status, and Types */}
        <Box>
          {/* Pokemon ID and Name */}
          <Flex alignItems="center" gap={2} mb={2}>
            <Text color="gray.600" fontFamily="mono">
              #{String(id).padStart(3, '0')}
            </Text>
            <Text
              textTransform={'capitalize'}
              color={'black'}
              fontSize="xl"
              fontWeight="medium"
            >
              {name}
            </Text>
          </Flex>

          {/* Star and Catch Status */}
          <Flex alignItems="center" gap={2} mb={4}>
            <Text color="yellow" fontSize="xl">
              ★
            </Text>
            {isCaught && (
              <Box
                bg="green.500"
                w="24px"
                h="24px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontSize="sm">
                  ✓
                </Text>
              </Box>
            )}
          </Flex>

          {/* Pokemon Types */}
          {/* <Flex gap={2}>
            {types.map((type, index) => (
              <Box
                key={index}
                px={4}
                py={1}
                borderRadius="full"
                border="1px solid"
                borderColor="gray.300"
                bg="whiteAlpha.500"
                textAlign="center"
                color={'black'}
              >
                <Text fontSize="sm">{type}</Text>
              </Box>
            ))}
          </Flex> */}

          <Flex justifyContent="left" gap={5}>
            {type.map((t, index) => (
              <TypeBadge key={`${t}-${index}`} type={t} index={index} />
            ))}
          </Flex>
        </Box>

        {/* Right side: Pokemon Image with Pokeball Background */}
        <Box position="relative">
          <Image
            src={imageUrl}
            alt={name}
            w="96px"
            h="96px"
            objectFit="contain"
            position="relative"
            zIndex={1}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default DemoCard;
