import { useState, useEffect } from 'react';
import { Center, Button, Text } from '@chakra-ui/react';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import { getType } from '../utils';

function PokemonListPage() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState(
    'https://pokeapi.co/api/v2/pokemon?limit=20'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  // Fetch Pokémon data from the API.
  const getAllPokemons = async () => {
    // Prevent fetching if already loading or if there are no more pages.
    if (isLoading || !loadMore) return;

    setIsLoading(true);
    try {
      const res = await fetch(loadMore);
      const data = await res.json();

      // Update URL for the next batch.
      setLoadMore(data.next);

      // Fetch detailed data for each Pokémon.
      const pokemonDataPromises = data.results.map(async pokemon => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        return await res.json();
      });

      const pokemonData = await Promise.all(pokemonDataPromises);

      // Add new Pokémon to the existing list and sort by ID.
      setAllPokemons(prevList =>
        [...prevList, ...pokemonData].sort((a, b) => a.id - b.id)
      );
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and mobile landscape orientation check.
  useEffect(() => {
    // Load the initial Pokémon.
    getAllPokemons();

    // Check mobile landscape orientation.
    const checkMobileLandscape = () => {
      const isLandscape =
        window.innerWidth > window.innerHeight && window.innerWidth <= 918;
      setIsMobileLandscape(isLandscape);
    };

    checkMobileLandscape();
    window.addEventListener('resize', checkMobileLandscape);

    return () => {
      window.removeEventListener('resize', checkMobileLandscape);
    };
  }, []);

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
          Pokémon List
        </Text>
      </Center>

      {/* Container for Pokémon cards */}
      <Center
        p="50px"
        flexWrap="wrap"
        gap="30px"
        overflow="scroll"
        m="10px"
        maxH="75vh"
      >
        {allPokemons.map(p => (
          <PokemonCard
            key={p.id}
            card={p}
            src={p.sprites.other['official-artwork'].front_default}
            src2={p.sprites.other.showdown?.front_default || ''}
            name={p.name}
            pokemon={p}
            type={getType(p.types)}
            id={p.id}
            isMobileLandscape={isMobileLandscape}
          />
        ))}
      </Center>

      {/* "Load More" Button */}
      <Center mb={4}>
        <Button
          mt="5px"
          colorScheme="red"
          onClick={getAllPokemons}
          isLoading={isLoading}
          disabled={!loadMore}
        >
          {loadMore ? 'Load More' : 'No More Pokémon'}
        </Button>
      </Center>
    </>
  );
}

export default PokemonListPage;
