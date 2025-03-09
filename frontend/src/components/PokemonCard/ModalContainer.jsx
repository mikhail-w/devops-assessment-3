import { useEffect, useState, memo } from 'react';
import {
  Box,
  Flex,
  Text,
  ModalHeader,
  Image,
  ModalContent,
} from '@chakra-ui/react';
import FlavorText from './FlavorText';
import PokemonTabs from './PokemonTabs';
import EvolutionChain from './EvolutionChain';
import CatchReleaseButton from './CatchReleaseButton';
import MobileModalContainer from './MobileModalContainer';
import ball from '../../assets/images/pokeballs/pokeball.png';
import '../../assets/styles/PokeDetail.css';
import TypeBadge from './TypeBadge';
import ExpandButton from './ExpandButton';
import ModalBackButton from './ModalBackButton';
import { getFontSize, getIdPosition, getIdFontSize } from '../../utils';

const MOBILE_BREAKPOINT = 900;
const DEFAULT_BACKGROUND = ['#fff', '#f8f9fa'];

const ModalContainer = ({
  card = {},
  name = '',
  id = '',
  src,
  type = [],
  onClose,
  onExpand,
  isExpanded,
  evoNames = [],
  pokeInfo = {},
  flavorTextArray,
  backgroundColor = DEFAULT_BACKGROUND,
  isMobileLandscape,
}) => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= MOBILE_BREAKPOINT
  );
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);

    document.body.style.overflow = isExpanded ? 'hidden' : 'auto';

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(false);
    }
  }, [isExpanded]);

  const handleExpandClick = () => {
    if (isExpanded) {
      setIsContentVisible(false);
      setTimeout(() => {
        onExpand();
      }, 300);
    } else {
      onExpand();
    }
  };

  // Return mobile version if screen width is below breakpoint
  if (isMobile) {
    return (
      <MobileModalContainer
        card={card}
        name={name}
        id={id}
        src={src}
        type={type}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
        backgroundColor={`linear-gradient(in lch, ${backgroundColor[0]}, ${backgroundColor[1]})`}
        pokeInfo={pokeInfo}
        flavorTextArray={flavorTextArray}
        evoNames={evoNames}
      />
    );
  }

  // Desktop version
  return (
    <ModalContent
      w="90%"
      className={
        isExpanded
          ? `modal-content ${isMobile ? 'extended-column' : 'extended-row'}`
          : 'modal-content'
      }
      background={`linear-gradient(in lch, ${backgroundColor[0]}, ${backgroundColor[1]})`}
      alignItems="center"
      borderRadius="50px"
      overflow={isMobileLandscape ? 'scroll' : 'hidden'}
      maxHeight={isMobile ? '80vh' : 'fit-content'}
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <Box w="100%" maxWidth="450px" marginTop="10px">
        <Flex
          w="90%"
          margin="20px auto"
          justifyContent="space-between"
          alignItems="center"
        >
          <ModalBackButton onClose={onClose} />
          <CatchReleaseButton id={id} name={name} />
        </Flex>

        <ModalHeader textTransform="capitalize" w="100%" textAlign="center">
          <Flex
            position="relative"
            justifyContent="space-between"
            marginBottom="10px"
          >
            <Text
              className="modal-title"
              fontSize={getFontSize(name, isMobile)}
            >
              {name || 'Unknown Pokémon'}
            </Text>
            <Box
              position="absolute"
              {...getIdPosition(String(id), isMobile)}
              className="background-watermark"
            >
              <Text fontSize={getIdFontSize(String(id), isMobile)}>
                #{String(id || '000').padStart(3, '0')}
              </Text>
            </Box>
          </Flex>

          <Flex justifyContent="left" flexWrap="wrap" gap={5}>
            {type.map((t, index) => (
              <TypeBadge key={`${t}-${index}`} type={t} index={index} />
            ))}
          </Flex>
        </ModalHeader>

        <Flex
          w="100%"
          justifyContent="center"
          marginBottom="20px"
          position="relative"
        >
          <Image
            src={src || ball}
            maxW={{ base: '200px', md: '300px' }}
            alt={name || 'Pokémon'}
          />
          <ExpandButton
            isMobile={isMobile}
            isExpanded={isExpanded}
            onClick={handleExpandClick}
          />
        </Flex>

        <PokemonTabs card={card} pokeInfo={pokeInfo} />
      </Box>

      <Box
        width="100%"
        height="100%"
        className={isMobile ? 'mobile-extended' : ''}
      >
        <Flex className="extended-section">
          <div
            className={`extended-content ${isContentVisible ? 'visible' : ''}`}
          >
            <FlavorText flavorTextArray={flavorTextArray} onInfo={false} />
            <EvolutionChain evoNames={evoNames} />
          </div>
        </Flex>
      </Box>
    </ModalContent>
  );
};

export default memo(ModalContainer);
