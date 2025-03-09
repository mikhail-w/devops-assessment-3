import { useCallback, useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getPokemonById, getPokemonByType } from '../services/pokemonService';
import { getRandomID } from '../utils';
import MainPokemonTab from '../components/MainPokemonTab';
import GenerateButton from '../components/GenerateButton';
import { Box, useBreakpointValue } from '@chakra-ui/react';

function RandPokemonPage() {
  const [valid, setValid] = useState(false);
  const [randomID, setRandomID] = useState(null);
  const timerId = useRef(null);
  const { setTeam, setPokemon, setIsLoading } = useOutletContext();

  const isMobileLandscape = useBreakpointValue({
    base: false,
    sm: window.innerWidth > window.innerHeight && window.innerWidth <= 918,
  });

  const getRandomPokemon = useCallback(async () => {
    setIsLoading(true);
    try {
      const randomID = getRandomID(1025);
      setRandomID(randomID);

      const mainPokemon = await getPokemonById(randomID);
      setPokemon(mainPokemon);
      window.localStorage.setItem('MAIN_POKEMON', JSON.stringify(mainPokemon));

      const teamTypeURL = mainPokemon.types[0]?.type.url;
      if (!teamTypeURL) throw new Error('Main Pokémon type URL not found.');

      const teamDataResponse = await getPokemonByType(teamTypeURL);
      const teamIndexes = new Set();

      while (teamIndexes.size < 5) {
        teamIndexes.add(getRandomID(teamDataResponse.pokemon.length));
      }

      const teamData = await Promise.all(
        [...teamIndexes].map(index =>
          getPokemonById(teamDataResponse.pokemon[index].pokemon.name)
        )
      );

      setTeam(teamData);
      window.localStorage.setItem(
        'MAIN_POKEMON_TEAM',
        JSON.stringify(teamData)
      );
      setValid(true);
    } catch (error) {
      setValid(false);
      console.error('Failed to fetch Pokémon data:', error.message || error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setPokemon, setTeam]);

  useEffect(() => {
    getRandomPokemon();
    return () => clearTimeout(timerId.current);
  }, [getRandomPokemon]);

  return (
    <Box>
      {valid && randomID && (
        <MainPokemonTab id={randomID} isMobileLandscape={isMobileLandscape} />
      )}
      <GenerateButton
        getRandomPokemon={getRandomPokemon}
        isMobileLandscape={isMobileLandscape}
      />
    </Box>
  );
}

export default RandPokemonPage;
