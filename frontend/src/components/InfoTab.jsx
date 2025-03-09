import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Container,
  useColorModeValue,
  Table,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import CatchReleaseButton from './PokemonCard/CatchReleaseButton';

function InfoTab() {
  const { pokemon } = useOutletContext();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  if (!pokemon) {
    return (
      <Container centerContent>
        <Text fontSize="lg">Loading...</Text>
      </Container>
    );
  }

  const { name, id, height, weight, moves, types, abilities } = pokemon;

  // Process types
  const pokemonTypes = types.map(type => type.type.name);

  // Process abilities
  const abilityList = abilities
    .map(ability => ability.ability.name.replace('-', ' '))
    .join(', ');

  // Get first 4 moves
  const movesToDisplay = moves
    .slice(0, 4)
    .map(move => move.move.name.replace('-', ' '))
    .join(', ');

  // Height conversion
  const heightInMeters = height / 10;
  const totalInches = heightInMeters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return (
    <Container maxW="container.md" py={6}>
      <Box bg={bgColor} borderRadius="lg" boxShadow="base" overflow="hidden">
        <Box p={6}>
          {/* Header */}
          <Flex justify="space-between" align="center" mb={4}>
            <Flex align="center" justify="flex-start" width="100%">
              <Heading size="lg" textTransform="capitalize">
                {name}
              </Heading>
              <Box pl={'10%'} pt={'6%'}>
                <CatchReleaseButton id={id} name={name} />
              </Box>
            </Flex>
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              #{String(id).padStart(3, '0')}
            </Text>
          </Flex>

          {/* Types */}
          <Flex gap={2} mb={4}>
            {pokemonTypes.map(type => (
              <Badge
                key={type}
                colorScheme={getTypeColor(type)}
                padding="1"
                px={3}
                borderRadius="full"
                textTransform="capitalize"
                fontSize="sm"
              >
                {type}
              </Badge>
            ))}
          </Flex>

          {/* Info Table */}
          <Table variant="simple" size="sm">
            <Tbody>
              <Tr>
                <Td fontWeight="bold" width="30%">
                  Height
                </Td>
                <Td>{`${heightInMeters.toFixed(2)} m (${feet}'${inches}")`}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Weight</Td>
                <Td>{`${((weight / 10) * 2.2046).toFixed(2)} lbs`}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Abilities</Td>
                <Td textTransform="capitalize">{abilityList}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Moves</Td>
                <Td textTransform="capitalize">{movesToDisplay}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
}

// Helper function to map Pokemon types to Chakra UI color schemes
function getTypeColor(type) {
  const typeColors = {
    normal: 'gray',
    fire: 'red',
    water: 'blue',
    electric: 'yellow',
    grass: 'green',
    ice: 'cyan',
    fighting: 'orange',
    poison: 'purple',
    ground: 'orange',
    flying: 'blue',
    psychic: 'pink',
    bug: 'green',
    rock: 'orange',
    ghost: 'purple',
    dragon: 'purple',
    dark: 'gray',
    steel: 'gray',
    fairy: 'pink',
  };
  return typeColors[type] || 'gray';
}

export default InfoTab;
