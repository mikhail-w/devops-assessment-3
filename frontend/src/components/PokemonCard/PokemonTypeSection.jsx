import { useState, useEffect, useRef } from 'react';
import { typeIcons } from '../../icons';
import { colors } from '../../utils';
import { Center, Tooltip, Image } from '@chakra-ui/react';

const PokemonTypeSection = ({ type }) => {
  const [isTooltip1Open, setIsTooltip1Open] = useState(false);
  const [isTooltip2Open, setIsTooltip2Open] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsTooltip1Open(false);
        setIsTooltip2Open(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClick = (e, setTooltip) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      setTooltip(prev => !prev);
    }
  };

  return (
    <Center className="tip" mt={5} gap="10px" ref={containerRef}>
      <Tooltip
        label={type[0]}
        placement="bottom"
        textTransform="uppercase"
        fontSize="sm"
        color="black"
        hasArrow
        arrowSize={15}
        bg={colors[type[0]]}
        isOpen={window.innerWidth <= 768 ? isTooltip1Open : undefined}
      >
        <Image
          className="type-icon"
          width="40px"
          height="40px"
          src={typeIcons[type[0]]}
          onClick={e => handleClick(e, setIsTooltip1Open)}
          cursor="pointer"
        />
      </Tooltip>
      {type[1] && (
        <Tooltip
          label={type[1]}
          textTransform="uppercase"
          placement="bottom"
          fontSize="sm"
          color="black"
          hasArrow
          arrowSize={15}
          bg={colors[type[1]]}
          isOpen={window.innerWidth <= 768 ? isTooltip2Open : undefined}
        >
          <Image
            className="type-icon"
            width="40px"
            height="40px"
            src={typeIcons[type[1]]}
            onClick={e => handleClick(e, setIsTooltip2Open)}
            cursor="pointer"
          />
        </Tooltip>
      )}
    </Center>
  );
};

export default PokemonTypeSection;
