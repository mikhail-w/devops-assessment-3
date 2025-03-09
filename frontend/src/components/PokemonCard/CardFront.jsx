import { useState } from 'react';
import InfoIcon from '../PokemonCard/InfoIcon ';
import { motion } from 'framer-motion';
import CatchReleaseButton from './CatchReleaseButton';
import PokemonTypeSection from './PokemonTypeSection';
import { Flex, Image, Text, Box, Center } from '@chakra-ui/react';

function CardFront({
  src,
  name,
  id,
  type,
  onFlip,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
  onOpenModal,
  backgroundColor,
}) {
  const MotionImage = motion(Image);
  const [hovered, setHovered] = useState(false);

  return (
    <Flex
      onMouseEnter={() => {
        handleMouseEnter();
        setHovered(true);
      }}
      onMouseLeave={() => {
        handleMouseLeave();
        setHovered(false);
      }}
      flexDirection="column"
      justifyContent="center"
      className={`pokemonCard ${hovered ? type[0] : ''}`}
      position="relative"
      overflow="hidden"
      background={`linear-gradient(${backgroundColor[0]}, ${backgroundColor[1]})`}
      p={5}
    >
      {/* HEADER */}
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <CatchReleaseButton id={id} name={name} />
        </Box>
        <Box>
          <Text className="poke__number" color="gray.700">
            #{String(id).padStart(3, '0')}
          </Text>
        </Box>
        <InfoIcon onOpenModal={onOpenModal} id={id} handleClick={handleClick} />
      </Flex>

      {/* IMAGE */}
      <Center p="1px" m="8px">
        <MotionImage
          onClick={onFlip}
          src={src || '/images/default.png'}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3 }}
          maxHeight="180px" // Restrict max height
          width="auto"
          objectFit="contain" // Ensures image scales within bounds
        />
      </Center>

      {/* NAME */}
      <Center whiteSpace="nowrap" width="182px" height="26px">
        <Text
          className="pokemonName"
          fontSize={name.length > 15 ? '10px' : '15px'}
        >
          {name}
        </Text>
      </Center>

      {/* TYPE */}
      <PokemonTypeSection type={type} />
    </Flex>
  );
}

export default CardFront;
