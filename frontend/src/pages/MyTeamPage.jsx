import { Center, SimpleGrid, Image, Text, Box } from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import BackButton from '../components/BackButton';
import noCatch from '../assets/images/pokeballs/ball-no-catch.png';
import '../assets/styles/MyTeamPage.css';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import { getType } from '../utils';
import Loading from '../components/Loading';
import { getPokemonById } from '../services/pokemonService';
import { AnimatePresence } from 'framer-motion';
import backendApiClient from '../services/backendApiClient';

function MyTeamPage() {
  console.log('MyTeamPage: Component rendered');

  const { myTeam, setMyTeam } = useOutletContext();
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingCard, setAnimatingCard] = useState(null);
  const timerId = useRef(null);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);
  const dataFetchedRef = useRef(false);

  console.log('MyTeamPage: Current state', {
    myTeamLength: myTeam?.length,
    pokemonDataLength: pokemonData?.length,
    isLoading: loading,
    isLoggedIn,
    hasToken: Boolean(token),
    dataFetched: dataFetchedRef.current,
  });

  // Handle mobile landscape mode
  useEffect(() => {
    console.log('MyTeamPage: Mobile landscape effect triggered');

    function checkMobileLandscape() {
      const isLandscape =
        window.innerWidth > window.innerHeight && window.innerWidth <= 918;
      console.log('MyTeamPage: Checking mobile landscape:', { isLandscape });
      setIsMobileLandscape(isLandscape);
    }

    checkMobileLandscape();
    window.addEventListener('resize', checkMobileLandscape);

    return () => {
      console.log('MyTeamPage: Cleaning up mobile landscape effect');
      window.removeEventListener('resize', checkMobileLandscape);
      clearTimeout(timerId.current);
    };
  }, []);

  // Initial team fetch
  useEffect(() => {
    console.log('MyTeamPage: Team fetch effect triggered', {
      isLoggedIn,
      dataFetched: dataFetchedRef.current,
    });

    const fetchTeam = async () => {
      if (isLoggedIn && !dataFetchedRef.current) {
        console.log('MyTeamPage: Fetching team from backend');
        try {
          const response = await backendApiClient.getUserTeam(token);
          console.log('MyTeamPage: Team fetch response:', response);

          if (response?.current_team) {
            console.log(
              'MyTeamPage: Updating team from backend:',
              response.current_team
            );
            setMyTeam(response.current_team);
          }
        } catch (error) {
          console.error('MyTeamPage: Error fetching team:', error);
        }
      } else {
        console.log('MyTeamPage: Skipping team fetch', {
          reason: !isLoggedIn ? 'not logged in' : 'already fetched',
        });
      }
      dataFetchedRef.current = true;
    };

    fetchTeam();
  }, [isLoggedIn, token, setMyTeam]);

  // Fetch Pokemon data when team changes
  useEffect(() => {
    console.log('MyTeamPage: Pokemon data fetch effect triggered', {
      teamSize: myTeam?.length,
    });

    const fetchPokemonData = async () => {
      console.log('MyTeamPage: Starting Pokemon data fetch');
      setLoading(true);

      try {
        if (myTeam.length === 0) {
          console.log('MyTeamPage: Empty team, clearing Pokemon data');
          setPokemonData([]);
        } else {
          console.log('MyTeamPage: Fetching Pokemon details for team:', myTeam);
          const responses = await Promise.all(
            myTeam.map(id => getPokemonById(id))
          );
          console.log('MyTeamPage: Pokemon data fetched:', responses);
          setPokemonData(responses);
        }
      } catch (error) {
        console.error('MyTeamPage: Error fetching Pokémon data:', error);
      } finally {
        console.log('MyTeamPage: Finishing Pokemon data fetch');
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [myTeam]);

  const releasePokemon = async id => {
    console.log('MyTeamPage: Release Pokemon triggered', { id });
    setAnimatingCard(id);

    setTimeout(async () => {
      if (isLoggedIn) {
        console.log('MyTeamPage: Releasing Pokemon (logged in)', { id });
        try {
          const response = await backendApiClient.updateUserTeam(
            token,
            id,
            'release'
          );
          console.log('MyTeamPage: Release response:', response);
          setMyTeam(response.current_team);
        } catch (error) {
          console.error('MyTeamPage: Failed to release Pokémon:', error);
        }
      } else {
        console.log('MyTeamPage: Releasing Pokemon (not logged in)', { id });
        setMyTeam(prevTeam => prevTeam.filter(pokemonId => pokemonId !== id));
      }

      setPokemonData(prevData => prevData.filter(pokemon => pokemon.id !== id));
      setAnimatingCard(null);
    }, 500);
  };

  console.log('MyTeamPage: Rendering with data', {
    hasTeam: pokemonData.length > 0,
    isLoading: loading,
  });

  return (
    <>
      <Center>
        <Text
          mb={{ base: '10px', lg: '20px' }}
          textDecoration="underline"
          textTransform="capitalize"
          textUnderlineOffset="8px"
          letterSpacing="5px"
          fontFamily="Pokemon Solid"
          fontSize={{ base: '1rem', lg: '2rem' }}
          as="h3"
        >
          My Pokémon Team {isLoggedIn ? '' : '(6 Max)'}
        </Text>
      </Center>

      <Center
        p="50px"
        flexWrap="wrap"
        gap="40px"
        overflow="scroll"
        m="10px"
        maxH="75vh"
      >
        {loading ? (
          <Center h="300px">
            <Loading />
          </Center>
        ) : pokemonData.length > 0 ? (
          <AnimatePresence>
            {pokemonData.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                card={pokemon}
                src={pokemon.sprites.other['official-artwork'].front_default}
                src2={pokemon.sprites.other.showdown?.front_default}
                name={pokemon.name}
                type={getType(pokemon.types)}
                id={pokemon.id}
                animating={animatingCard === pokemon.id}
                onRelease={() => releasePokemon(pokemon.id)}
              />
            ))}
          </AnimatePresence>
        ) : (
          <Center h="300px" flexDirection="column" gap={4}>
            <Image maxW="200px" src={noCatch} />
            <Text fontSize="xl">No Pokémon Caught Yet</Text>
          </Center>
        )}
      </Center>

      <Center marginTop="20px">
        <BackButton />
      </Center>
    </>
  );
}

export default MyTeamPage;
