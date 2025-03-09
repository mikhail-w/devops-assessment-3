import { getType } from '../utils';
import '../assets/styles/PokemonPage.css';
import Loading from '../components/Loading';
import BackButton from '../components/BackButton';
import { useEffect, useState, useRef } from 'react';
import { Center, Flex, Image, Text } from '@chakra-ui/react';
import { useOutletContext, useParams } from 'react-router-dom';
import { getPokemonById } from '../services/pokemonService';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import openBall from '../assets/images/pokeballs/open-ball.png';

function PokemonPage() {
  const {
    team,
    myTeam,
    disabled,
    setDisabled,
    isLoading,
    setIsLoading,
    pokemon,
    setPokemon,
    setIsCaught,
  } = useOutletContext();
  const [valid, setValid] = useState(false);
  const { name } = useParams();
  const timerId = useRef(null);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  const getPokemon = async () => {
    try {
      setIsLoading(true);
      const data = await getPokemonById(name.toLowerCase());
      setPokemon(data);
      setValid(true);
    } catch (err) {
      console.error('Error fetching Pokémon data:', err);
      setValid(false);
    } finally {
      timerId.current = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    function checkMobileLandscape() {
      const isLandscape =
        window.innerWidth > window.innerHeight && window.innerWidth <= 918;
      setIsMobileLandscape(isLandscape);
    }

    // Initial check
    checkMobileLandscape();
    getPokemon();

    // Listen for resize events
    window.addEventListener('resize', checkMobileLandscape);

    return () => {
      window.removeEventListener('resize', checkMobileLandscape);
      clearTimeout(timerId.current);
    };
  }, [name]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : valid ? (
        <Center
          marginTop={isMobileLandscape ? '' : '150px'}
          flexDirection={'column'}
        >
          <PokemonCard
            card={pokemon}
            src={pokemon.sprites.other[`official-artwork`].front_default}
            src2={pokemon.sprites.other.showdown.front_default}
            name={pokemon.name}
            pokemon={pokemon}
            type={getType(pokemon.types)}
            id={pokemon.id}
            isLoading={isLoading}
            team={team}
            disabled={disabled}
            setDisabled={setDisabled}
            myTeam={myTeam}
            setIsCaught={setIsCaught}
          />
          <Flex marginRight={isMobileLandscape ? '500px' : ''}>
            <BackButton />
          </Flex>
        </Center>
      ) : (
        <Center flexDirection={'column'} className="not-found" id="root">
          <Image src={openBall} />
          <Text>
            No Pokémon with name or id <span>`{name}`</span> exists!
          </Text>
        </Center>
      )}
    </>
  );
}

export default PokemonPage;
