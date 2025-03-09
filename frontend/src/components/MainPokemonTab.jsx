import React, { useCallback, useEffect, Suspense } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Image,
  Flex,
  Box,
  useColorModeValue,
  VStack,
  Container,
  useBreakpointValue,
} from '@chakra-ui/react';
import { CgPokemon } from 'react-icons/cg';
import { MdGif } from 'react-icons/md';
import { FaInfo } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import MainPokemonName from './MainPokemonName';
import LazyPokemonCard from './PokemonCard/PokemonCard';
import FlavorText from './PokemonCard/FlavorText';
import EvolutionChain from './PokemonCard/EvolutionChain';
import Loading from './Loading';
import { usePokemonData } from '../hooks/usePokemonData';
import ball from '../assets/images/pokeballs/pokeball.png';
import groupImg from '../assets/images/pokeballs/group.png';
import { getType } from '../utils';
import InfoTab from '../components/InfoTab';

// Component to handle the layout and styling of tab content
// Accepts height prop to control scrolling behavior
const TabContent = ({ children, height = 'auto', ...props }) => (
  <Center
    height={height}
    flexDirection="column"
    overflowY={height === 'auto' ? 'scroll' : 'hidden'}
    px={4}
    {...props}
  >
    {children}
  </Center>
);

// Reusable component for displaying Pokemon images
// Falls back to pokeball image if source is not available
const PokemonImage = ({ src, size = '90%' }) => (
  <Image maxW={size} maxH={size} src={src || ball} alt="Pokemon image" pb={8} />
);

// Main component for displaying Pokemon information in tabs
function MainPokemonTab({ id, isMobileLandscape }) {
  // Get shared context data including team and Pokemon information
  const { team, myTeam, disabled, setDisabled, isLoading, pokemon } =
    useOutletContext();

  // Custom hook to fetch and manage Pokemon data
  const { flavorTextArray, evoNames, fetchPokemonData } = usePokemonData();

  // Theme-aware background color
  const backgroundColor = useColorModeValue('white', 'gray.800');

  // Responsive tab sizes based on screen width
  const tabSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });

  // Calculate content height based on device orientation
  const contentHeight = isMobileLandscape
    ? 'calc(100vh - 70px)'
    : 'calc(100vh - 350px)';

  // Memoized function to fetch Pokemon data when ID changes
  const fetchData = useCallback(() => {
    if (id) fetchPokemonData(id);
  }, [id, fetchPokemonData]);

  // Fetch data when component mounts or ID changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Show loading state while data is being fetched
  if (isLoading || !pokemon) {
    return <Loading isMobileLandscape={isMobileLandscape} />;
  }

  // Destructure different sprite versions from Pokemon data
  const {
    'official-artwork': { front_default: pokemonArt } = {},
    showdown: { front_default: pokemonShowdown } = {},
    home: { front_default: pokemonHome } = {},
  } = pokemon.sprites.other;

  return (
    // Main tabs container with responsive orientation
    <Tabs
      width={isMobileLandscape ? '700px' : 'auto'}
      align="center"
      variant="enclosed"
      size={tabSize}
      orientation={isMobileLandscape ? 'vertical' : 'horizontal'}
    >
      <TabPanels mt={isMobileLandscape ? '-1' : { base: 0, md: 5 }}>
        {/* Home Sprite Tab */}
        <TabPanel>
          <VStack spacing={4}>
            <MainPokemonName isMobileLandscape={isMobileLandscape} />
            <TabContent height={contentHeight}>
              <PokemonImage src={pokemonHome} />
            </TabContent>
          </VStack>
        </TabPanel>

        {/* Official Artwork Tab */}
        <TabPanel>
          <VStack spacing={4}>
            <MainPokemonName isMobileLandscape={isMobileLandscape} />
            <TabContent height={contentHeight}>
              <PokemonImage src={pokemonArt} />
            </TabContent>
          </VStack>
        </TabPanel>

        {/* Showdown Sprite Tab */}
        <TabPanel>
          <VStack spacing={4}>
            <MainPokemonName isMobileLandscape={isMobileLandscape} />
            <TabContent height={contentHeight}>
              <PokemonImage src={pokemonShowdown} />
            </TabContent>
          </VStack>
        </TabPanel>

        {/* Information Tab */}
        <TabPanel
          maxH={{ base: 'calc(100vh - 300px)', md: '600px' }}
          overflowY="auto"
          p={0}
        >
          {/* Sticky header with Pokemon name */}
          <Box
            position="sticky"
            top={0}
            py={4}
            bg={backgroundColor}
            width="full"
            zIndex={1}
          >
            <MainPokemonName isMobileLandscape={isMobileLandscape} />
          </Box>

          <Container>
            <VStack
              spacing={8}
              pb={isMobileLandscape ? 12 : { base: 48, lg: 72 }}
            >
              <InfoTab />
              {/* Conditional rendering of flavor text and evolution chain */}
              {flavorTextArray && (
                <FlavorText
                  isMobileLandscape={isMobileLandscape}
                  flavorTextArray={flavorTextArray}
                  onInfo
                />
              )}
              {evoNames && <EvolutionChain evoNames={evoNames} />}
            </VStack>
          </Container>
        </TabPanel>

        {/* Team Tab */}
        <TabPanel>
          <Box>
            <MainPokemonName
              isMobileLandscape={isMobileLandscape}
              pokemonName={pokemon.name}
              isTeam="true"
            />
          </Box>
          {/* Grid of Pokemon team cards */}
          <Flex
            wrap="wrap"
            pt={{ base: 5, md: 10, lg: 25 }}
            pb={{ base: 200 }}
            justify="center"
            maxW="full"
            h="auto"
            maxH={{ base: 'calc(100vh - 300px)', md: '500px' }}
            gap={10}
            overflowY="auto"
            mt={{ base: 30, md: 50, lg: 50 }}
          >
            {team.map((card, idx) => (
              <Suspense key={idx} fallback={<Loading />}>
                <LazyPokemonCard
                  index={idx}
                  card={card}
                  src={card.sprites.other['official-artwork']?.front_default}
                  src2={card.sprites.other.showdown?.front_default}
                  name={card.name}
                  pokemon={pokemon}
                  type={getType(card.types)}
                  id={card.id}
                  isLoading={isLoading}
                  team={team}
                  disabled={disabled}
                  setDisabled={setDisabled}
                  myTeam={myTeam}
                />
              </Suspense>
            ))}
          </Flex>
        </TabPanel>
      </TabPanels>

      {/* Tab navigation bar */}
      <Center>
        <TabList
          justifyContent="space-evenly"
          maxW="full"
          position="fixed"
          bottom={{ base: '100px', md: '120px' }}
          px={{ base: 4, md: 5 }}
          bg={backgroundColor}
          top={isMobileLandscape ? '60px' : undefined}
          ml={isMobileLandscape ? '50px' : undefined}
        >
          {/* Tab icons for different views */}
          <Tab>
            <CgPokemon
              color="#ef5350"
              size={isMobileLandscape ? '.7em' : '2em'}
            />
          </Tab>
          <Tab>
            <CgPokemon
              color="#ffcc00"
              size={isMobileLandscape ? '.7em' : '2em'}
            />
          </Tab>
          <Tab>
            <MdGif color="#396bba" size={isMobileLandscape ? '.7em' : '2em'} />
          </Tab>
          <Tab>
            <FaInfo color="#188038" size={isMobileLandscape ? '.7em' : '2em'} />
          </Tab>
          <Tab>
            <Image
              src={groupImg}
              alt="Group image"
              size={isMobileLandscape ? '.7em' : '2em'}
              objectFit="contain"
            />
          </Tab>
        </TabList>
      </Center>
    </Tabs>
  );
}

export default MainPokemonTab;
