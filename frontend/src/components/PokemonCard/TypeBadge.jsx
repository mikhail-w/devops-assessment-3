import React, { memo } from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';
import { colors } from '../../utils';
import { modalIcons } from '../../icons';
import ball from '../../assets/images/pokeballs/pokeball.png';

const TypeBadge = memo(({ type, index }) => (
  <Flex
    cursor="pointer"
    bg={colors[type] || 'gray.300'}
    // marginLeft={index === 0 ? '0px' : '10px'}
    alignItems="center"
    padding="8px 12px"
    borderRadius="12px"
    boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
    transition="transform 0.2s, box-shadow 0.2s"
    _hover={{
      transform: 'scale(1.05)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.3)',
    }}
  >
    <Image w="24px" h="24px" src={modalIcons[type] || ball} />
    <Text
      paddingLeft="8px"
      fontWeight="bold"
      fontSize="14px"
      color="white"
      textShadow="0px 1px 2px rgba(0, 0, 0, 0.8)"
    >
      {type}
    </Text>
  </Flex>
));

TypeBadge.displayName = 'TypeBadge';

export default TypeBadge;
