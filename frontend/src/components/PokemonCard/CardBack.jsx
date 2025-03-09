import { Image, Center } from '@chakra-ui/react';
import { useState } from 'react';
import fallbackImage from '../../assets/images/pokeballs/pokeball.png';

function CardBack({ src2, type, onFlip, backgroundColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Center
      className={`pokemonCard ${hovered ? type[0] : ''}`}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      background={`linear-gradient(${backgroundColor[0]}, ${backgroundColor[1]})`}
      justifyContent="center"
      alignItems="center"
      role="button"
      aria-label="Flip card"
      cursor="pointer"
    >
      <Image
        className="back-image"
        onClick={onFlip}
        maxH="200px"
        src={src2 || fallbackImage}
        alt="Pokémon card back"
      />
    </Center>
  );
}

export default CardBack;
