import React, { memo } from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';
import { colors } from '../../utils';
import { modalIcons } from '../../icons';
import ball from '../../assets/images/pokeballs/pokeball.png';

const TypeBadge = memo(({ type, index }) => (
  <Flex
    cursor="pointer"
    bg={colors[type] || 'gray.300'}
    alignItems="center"
    padding="5px 9px"
    borderRadius="12px"
    boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
    transition="transform 0.2s, box-shadow 0.2s"
    _hover={{
      transform: 'scale(1.05)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.3)',
    }}
    outline={'1px solid white'}
  >
    <Image w="15px" h="15px" src={modalIcons[type] || ball} />
    <Text
      textTransform={'capitalize'}
      paddingLeft="4px"
      fontWeight="bold"
      fontSize="12px"
      color="gray.700"
    >
      {type}
    </Text>
  </Flex>
));

TypeBadge.displayName = 'TypeBadge';

export default TypeBadge;
