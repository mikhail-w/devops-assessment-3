import bulbasaur from '../assets/images/pokemon/bulbasaur.png';
import pikachu from '../assets/images/pokemon/pikachu.png';
import charizard from '../assets/images/pokemon/charizard.png';
import pokedex from '../assets/images/pokemon/pokedex.png';
import pokeball3 from '../assets/images/pokeballs/pokeball3.png';
import ballOutline2 from '../assets/images/pokeballs/balloutline2.png';
import ballOutline3 from '../assets/images/pokeballs/balloutline3.svg';
import { Center, useColorModeValue, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

function HomePageImages({ isMobileLandscape }) {
  return (
    <>
      <div
        className={
          isMobileLandscape ? 'ballOutline2 landscape' : 'ballOutline2'
        }
      >
        <img src={ballOutline2} alt="pokeball outline" />
      </div>
      <div className="ballOutline3">
        <img src={ballOutline3} alt="pokeball" />
      </div>
      <Box className="logo">
        <img src={pokedex} alt="pokedex logo" />
      </Box>
      <div className="pokemon bulbasaur">
        <img src={bulbasaur} alt="bulbasaur" />
      </div>
      <div className="pokemon pikachu">
        <img src={pikachu} alt="pikachu" />
      </div>
      <div
        className={
          isMobileLandscape
            ? 'pokemon charizard landscape'
            : 'pokemon charizard'
        }
      >
        <img src={charizard} alt="charizard" />
      </div>
      <div className="pokeball3">
        <img src={pokeball3} alt="pokeballs" />
      </div>
    </>
  );
}

export default HomePageImages;
