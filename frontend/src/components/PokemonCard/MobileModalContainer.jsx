import React, { useState } from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoArrowDownCircleOutline } from 'react-icons/io5';
import CatchReleaseButton from './CatchReleaseButton';
import MobileTypeBadge from './MobileTypeBadge';
import PokemonTabs from './PokemonTabs';
import FlavorText from './FlavorText';
import EvolutionChain from './EvolutionChain';
import wm from '../../assets/images/pokeballs/balloutline1.png';
import ModalBackButton from './ModalBackButton';
import { getFontSize, getIdPosition, getIdFontSize } from '../../utils';

const MobileExpandButton = ({ isExpanded, onClick }) => (
  <IoArrowDownCircleOutline
    onClick={onClick}
    size="3em"
    className={
      isExpanded ? 'extend-modal isExtended' : 'extend-modal notExtended'
    }
  />
);

const MobileModalContainer = ({
  name = '',
  id = '',
  src,
  type = [],
  card = {},
  onClose,
  backgroundColor = ['#fff', '#f8f9fa'],
  pokeInfo = {},
  flavorTextArray = [],
  evoNames = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const handleExpandClick = () => {
    if (isExpanded) {
      setIsContentVisible(false);
      setTimeout(() => {
        setIsExpanded(false);
      }, 300);
    } else {
      setIsExpanded(true);
      setIsContentVisible(true);
    }
  };

  return (
    <Box
      h="100vh"
      bgGradient={backgroundColor}
      display="flex"
      flexDirection="column"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      zIndex={8000}
      overflow={isExpanded ? 'auto' : 'hidden'}
    >
      {/* Watermark Container */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={1}
        overflow="hidden"
      >
        <Image
          src={wm}
          alt="Watermark"
          position="absolute"
          top="30%"
          right="-30%"
          transform="translateY(-50%) rotate(15deg)"
          width="800px"
          height="800px"
          opacity={0.4}
          objectFit="contain"
        />
      </Box>

      {/* Content Container */}
      <Flex direction="column" h="100%" zIndex={2}>
        {/* Header Section */}
        <Flex p="2" direction="column" color="white">
          <Flex align="center" mb="4">
            <Flex
              w="90%"
              margin="20px auto"
              justifyContent="space-between"
              alignItems="center"
            >
              <ModalBackButton onClose={onClose} />
              <CatchReleaseButton id={id} name={name} />
            </Flex>
          </Flex>
          {/* <Text color={'black'} mt={-5} ml="5" fontSize="lg">
            #{String(id).padStart(3, '0')}
          </Text> */}
          <Box
            color={'rgba(255, 255, 255, 0.2)'}
            textShadow={'1px 1px 2px rgba(0, 0, 0, 0.5)'}
            mt={10}
            pl={'40%'}
            position="absolute"
          >
            {/* <Text fontSize={80}>#{String(id || '000').padStart(3, '0')}</Text> */}
            {/* <Text fontSize={getIdFontSize(String(id), true)}>
              #{String(id || '000').padStart(3, '0')}
            </Text> */}
            <Box position="absolute" {...getIdPosition(String(id), true)}>
              <Text fontSize={getIdFontSize(String(id), true)}>
                #{String(id || '000').padStart(3, '0')}
              </Text>
            </Box>
          </Box>
          <Text
            color={'black'}
            fontSize="2xl"
            fontWeight="bold"
            ml="5"
            mb="2"
            mt={-5}
            textTransform="capitalize"
          >
            {name}
          </Text>
        </Flex>

        {/* Type Badges */}
        <Flex gap="2" flexDir="column" alignSelf="flex-start" ml="6">
          {type.map((t, index) => (
            <MobileTypeBadge key={`${t}-${index}`} type={t} index={index} />
          ))}
        </Flex>

        {/* Pokemon Image */}
        <Flex
          position="relative"
          width="350px"
          height="350px"
          justify="center"
          alignSelf="center"
          mt="2"
        >
          <Image src={src} alt={name} w="100%" h="100%" objectFit="contain" />
          <Box position="absolute" bottom="5" right="0" mb="2" mr="2">
            <MobileExpandButton
              isExpanded={isExpanded}
              onClick={handleExpandClick}
            />
          </Box>
        </Flex>

        {/* Tabs Section*/}
        <Box mt="auto">
          <PokemonTabs card={card} pokeInfo={pokeInfo} />
        </Box>

        {/* Expandable Content */}
        <Box width="100%" height="100%">
          <Flex className="extended-section">
            <Box
              className={`extended-content ${
                isContentVisible ? 'visible' : ''
              }`}
              width="100%"
            >
              <FlavorText flavorTextArray={flavorTextArray} onInfo={false} />
              <EvolutionChain evoNames={evoNames} />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default MobileModalContainer;
